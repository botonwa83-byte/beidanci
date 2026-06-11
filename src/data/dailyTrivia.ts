import wordOriginsData from './wordOrigins.json';

// ==================== 今日词源冷知识（词源宇宙·流行性引擎） ====================
// 每天从 wordOrigins 里按日期定一条身世故事，全体用户当天一致（同今日神词的打法）。
// 词库外的故事（sandwich/robot/boycott…）也照常入选——冷知识不要求这个词能学，
// 只要求故事好讲、配 RN 自带 Share 转发（零原生依赖）。

export interface DailyTrivia {
  word: string;
  story: string;
}

const entries: DailyTrivia[] = Object.entries(
  wordOriginsData as Record<string, string>,
).map(([word, story]) => ({word, story}));

/** 今日冷知识：按日期确定。质数步长跳着取，避免和 JSON 编写顺序同步推进 */
export const getDailyTrivia = (): DailyTrivia => {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return entries[(dayIndex * 131) % entries.length];
};

/** 分享文案：冷知识 + slogan，自带传播钩子 */
export const buildTriviaShareMessage = (t: DailyTrivia): string =>
  `🧠 今日词源冷知识\n` +
  `${t.word} —— ${t.story}\n\n` +
  `没有一个单词是凭空来的。\n` +
  `—— WordPulse 背单词（by King Top）`;
