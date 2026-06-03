import {allWords} from './wordDatabase';
import {Word} from './types';

/**
 * 猜词模块数据源。
 *
 * 设计目标（卖点）：让用户体验到"装了 WordPulse 就拥有猜词超能力"——
 * 只看词根词缀的含义，就能推断出一个从没背过的名词的意思。
 *
 * 选词规则（从全部词库自动精选，无需手工维护清单）：
 *  - 名词（partOfSpeech 含 'n'）——名词意义最具体，最适合"拼词根猜义"
 *  - 至少 2 个词素（morphemes.length >= 2）——必须可拆解，否则无从推理
 *  - 单词长度 >= 5——太短的词缺乏拆解乐趣
 *  - 有完整中文释义
 * 命中后按 frequency 降序、level 升序排序（高频、易懂的优先），取前 200 个。
 * 结果在模块加载时计算一次并缓存，确定且无随机。
 */
const TARGET_COUNT = 200;

const isNoun = (w: Word) => /\bn\b|n\./i.test(w.partOfSpeech || '');

const buildGuessWords = (): Word[] => {
  const seen = new Set<string>();
  const candidates = allWords.filter(w => {
    if (!isNoun(w)) return false;
    if (!w.morphemes || w.morphemes.length < 2) return false;
    if (!w.word || w.word.length < 5) return false;
    if (!w.meaning) return false;
    const key = w.word.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  candidates.sort((a, b) => {
    if ((b.frequency || 0) !== (a.frequency || 0)) {
      return (b.frequency || 0) - (a.frequency || 0);
    }
    return (a.level || 0) - (b.level || 0);
  });

  return candidates.slice(0, TARGET_COUNT);
};

export const guessWords: Word[] = buildGuessWords();

/** Fisher-Yates 洗牌，返回新数组，不修改原数组 */
export const shuffleGuessWords = (): Word[] => {
  const arr = [...guessWords];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/** 把词素类型转成中文标签 */
export const morphemeTypeLabel = (type: string): string =>
  type === 'prefix' ? '前缀' : type === 'root' ? '词根' : '后缀';
