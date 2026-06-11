import {describe, it, expect} from '@jest/globals';
import {
  buildLazyQueue,
  finishLazySession,
  lazyTimings,
  MIN_GAP,
  NEW_WORD_PASSES,
} from '../src/data/lazySession';
import {
  getInitialProgress,
  createStudyPlan,
  getTodayMission,
} from '../src/data/learningLogic';

const freshProgress = () => {
  const p = getInitialProgress();
  return {...p, studyPlan: createStudyPlan(10)};
};

describe('懒人模式（lazySession）', () => {
  it('每个新词曝光 3 遍（pass 1/2/3 各一次）', () => {
    const queue = buildLazyQueue(freshProgress());
    expect(queue).not.toBeNull();
    const counts = new Map<number, number[]>();
    for (const s of queue!.steps.filter(x => !x.isReview)) {
      counts.set(s.word.id, [...(counts.get(s.word.id) || []), s.pass]);
    }
    expect(counts.size).toBe(queue!.newWords.length);
    for (const passes of counts.values()) {
      expect(passes.sort()).toEqual([1, 2, 3]);
    }
  });

  it('同一个词两次曝光之间至少隔 MIN_GAP 个其他词', () => {
    const queue = buildLazyQueue(freshProgress());
    const n = queue!.newWords.length;
    if (n < MIN_GAP + 2) {
      return; // 批次太小时不保证
    }
    const lastSeen = new Map<number, number>();
    queue!.steps.forEach((s, i) => {
      const prev = lastSeen.get(s.word.id);
      if (prev !== undefined) {
        expect(i - prev).toBeGreaterThan(MIN_GAP);
      }
      lastSeen.set(s.word.id, i);
    });
  });

  it('播完一批：新词全部进 SM-2、任务完成、写入学习历史', () => {
    const progress = freshProgress();
    const queue = buildLazyQueue(progress)!;
    const after = finishLazySession(progress, queue);

    for (const w of queue.newWords) {
      expect(after.completedWords).toContain(w.id);
      expect(after.wordReviews[w.id]).toBeDefined();
      expect(after.wordReviews[w.id].nextReview > after.wordReviews[w.id].lastReview).toBe(true);
    }
    const mission = getTodayMission(after);
    expect(mission.completedNewWords.length).toBeGreaterThanOrEqual(
      queue.newWords.length,
    );
    expect(after.learningHistory.length).toBe(1);
    expect(after.streak).toBeGreaterThanOrEqual(1);
  });

  it('第 2/3 遍释义揭示晚于第 1 遍（回忆窗口），总时长一致', () => {
    expect(lazyTimings(2).meaningAt).toBeGreaterThan(lazyTimings(1).meaningAt);
    expect(lazyTimings(3).nextAt).toBe(lazyTimings(1).nextAt);
    expect(NEW_WORD_PASSES).toBe(3);
  });
});
