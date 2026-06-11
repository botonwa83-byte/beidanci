import {Word, UserProgress, DailyMission} from './types';
import {allWords} from './wordDatabase';
import {
  getTodayMission,
  generateNextBatch,
  markWordLearned,
  finishDailySession,
} from './learningLogic';

// ==================== 懒人模式（零操作自动播放） ====================
// 用户只盯着屏幕：每词自动展示约 8 秒（词→释义→例句分阶段浮现）后自动切下一个。
// 短期记忆曲线：每个新词在会话内曝光 3 遍，间隔重现（同词两次出现至少隔
// MIN_GAP 个其他词，约 0s/40s/100s 三次，正打在遗忘最陡的头几分钟）；
// 第 2/3 遍延迟揭示释义，制造"先回忆再核对"的窗口。
// 长期记忆曲线：批次结束按 quality=3 写入 SM-2（被动模式无自评，取中性值
// 让间隔保守增长），到期复习词下次开播自动混入队列。

export interface LazyStep {
  word: Word;
  /** 第几遍曝光：1=完整展示；2/3=延迟揭示释义（回忆窗口） */
  pass: 1 | 2 | 3;
  isReview: boolean;
}

export const NEW_WORD_PASSES = 3;
/** 同一个词两次曝光之间至少隔多少个其他词 */
export const MIN_GAP = 2;

const byId = (id: number): Word | undefined => allWords.find(w => w.id === id);

/** 旋转数组：让相邻两轮的同一个词错开位置，保证曝光间隔 */
const rotate = <T>(arr: T[], offset: number): T[] =>
  arr.length === 0
    ? arr
    : [...arr.slice(offset % arr.length), ...arr.slice(0, offset % arr.length)];

export interface LazyQueue {
  steps: LazyStep[];
  newWords: Word[];
  reviewWords: Word[];
  mission: DailyMission;
}

/**
 * 生成懒人播放队列：今日任务的未完成新词（3 遍间隔重现）+ 到期复习词（1 遍，
 * 穿插在轮次之间）。今日任务全部完成时自动取下一批。无词可学返回 null。
 */
export const buildLazyQueue = (progress: UserProgress): LazyQueue | null => {
  let mission: DailyMission = getTodayMission(progress);
  const remainingNew = (m: DailyMission) =>
    m.newWordIds.filter(id => !m.completedNewWords.includes(id));
  const remainingReview = (m: DailyMission) =>
    m.reviewWordIds.filter(id => !m.completedReviews.includes(id));

  if (remainingNew(mission).length + remainingReview(mission).length === 0) {
    mission = generateNextBatch(progress);
  }

  const newWords = remainingNew(mission)
    .map(byId)
    .filter(Boolean) as Word[];
  const reviewWords = remainingReview(mission)
    .map(byId)
    .filter(Boolean) as Word[];

  if (newWords.length + reviewWords.length === 0) {
    return null;
  }

  // 三轮新词，轮间错位；复习词拆两半垫在轮次之间（先激活旧记忆，也自然拉开间隔）。
  // 相邻两轮按 offset 旋转后，同一词的最小间距 = n - offset，
  // 故 offset ≤ n - MIN_GAP - 1 才能保证间隔（批次太小时尽力而为）
  const steps: LazyStep[] = [];
  const n = newWords.length;
  const offset = Math.max(1, Math.min(n - MIN_GAP - 1, Math.ceil(n / 2)));
  const half = Math.ceil(reviewWords.length / 2);
  const reviewA = reviewWords.slice(0, half);
  const reviewB = reviewWords.slice(half);

  reviewA.forEach(w => steps.push({word: w, pass: 2, isReview: true}));
  newWords.forEach(w => steps.push({word: w, pass: 1, isReview: false}));
  reviewB.forEach(w => steps.push({word: w, pass: 2, isReview: true}));
  rotate(newWords, offset).forEach(w =>
    steps.push({word: w, pass: 2, isReview: false}),
  );
  rotate(newWords, offset * 2).forEach(w =>
    steps.push({word: w, pass: 3, isReview: false}),
  );

  return {steps, newWords, reviewWords, mission};
};

/**
 * 批次播完写进度：新词与复习词都按 quality=3（中性）进 SM-2，
 * 并结算每日任务（连胜/升级/计划推进与手动模式同一套）。
 */
export const finishLazySession = (
  progress: UserProgress,
  queue: LazyQueue,
): UserProgress => {
  // 把本批任务挂到 progress 上，markWordLearned 才会累计
  // completedNewWords/completedReviews，finishDailySession 的每日统计才有实数
  let p: UserProgress = {...progress, todayMission: queue.mission};
  for (const w of queue.newWords) {
    p = markWordLearned(p, w.id, 3);
  }
  for (const w of queue.reviewWords) {
    p = markWordLearned(p, w.id, 3);
  }
  const score = queue.newWords.length * 5 + queue.reviewWords.length * 2;
  return finishDailySession(p, score);
};

/** 每词展示节奏（毫秒）：第 1 遍完整看，第 2/3 遍延迟揭示制造回忆窗口 */
export const lazyTimings = (pass: 1 | 2 | 3) =>
  pass === 1
    ? {meaningAt: 2500, exampleAt: 4000, nextAt: 8000}
    : {meaningAt: 3000, exampleAt: 4500, nextAt: 8000};
