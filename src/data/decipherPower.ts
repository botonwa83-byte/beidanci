import {UserProgress, WordMorpheme, Word} from './types';
import {allWords, coreRoots} from './wordDatabase';

// ==================== 破译力（隐性词汇量） ====================
// 词根记忆法的核心杠杆：学过的词根词缀碎片，能覆盖词库中多少"没背过却拆开就懂"的词。
// 一个词"可破译" = 没学过 + 至少 2 块碎片 + 每块碎片都在已知集合里。

// morpheme key 归一化：'-tion' 与 'tion' 等同，类型参与区分（root:in ≠ prefix:in-）
export const getMorphemeKey = (
  m: Pick<WordMorpheme, 'type' | 'text'>,
): string => m.type + ':' + m.text.toLowerCase().replace(/^-+|-+$/g, '');

// 预计算可拆解词（≥2 碎片）的 key 列表，模块加载一次
const decomposable: {id: number; len: number; keys: string[]}[] = allWords
  .filter(w => w.morphemes.length >= 2)
  .map(w => ({
    id: w.id,
    len: w.word.length,
    keys: w.morphemes.map(getMorphemeKey),
  }));

// 已知碎片集合：所有已学词的碎片 + 已学词根（含 a/b 变体写法）
export const getKnownMorphemes = (progress: UserProgress): Set<string> => {
  const known = new Set<string>();
  const completed = new Set(progress.completedWords);
  for (const w of allWords) {
    if (!completed.has(w.id)) {
      continue;
    }
    for (const m of w.morphemes) {
      known.add(getMorphemeKey(m));
    }
  }
  for (const rootId of progress.learnedRootIds) {
    const root = coreRoots.find(r => r.id === rootId);
    if (!root) {
      continue;
    }
    for (const variant of root.root.split('/')) {
      known.add(getMorphemeKey({type: 'root', text: variant.trim()}));
    }
  }
  return known;
};

export interface DecipherPower {
  decodableCount: number; // 没背过但碎片全认识的词数
  reachCount: number; // 已学 + 可破译 = 词汇触达
  knownMorphemeCount: number; // 已知碎片数
  decodableIds: number[]; // 全部可破译词 id
}

export const computeDecipherPower = (progress: UserProgress): DecipherPower => {
  const known = getKnownMorphemes(progress);
  const completed = new Set(progress.completedWords);
  const decodableIds: number[] = [];
  for (const entry of decomposable) {
    if (completed.has(entry.id)) {
      continue;
    }
    if (entry.keys.every(k => known.has(k))) {
      decodableIds.push(entry.id);
    }
  }
  return {
    decodableCount: decodableIds.length,
    reachCount: completed.size + decodableIds.length,
    knownMorphemeCount: known.size,
    decodableIds,
  };
};

// 扫荡批次：按词频降序取一批可破译词（先收割最有用的）
export const getHarvestBatch = (power: DecipherPower, n: number): Word[] => {
  const byId = new Map(allWords.map(w => [w.id, w]));
  return power.decodableIds
    .map(id => byId.get(id))
    .filter((w): w is Word => !!w)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, n);
};

// 展示用样板：挑最长的可破译词（越长越能体现"没背也能看懂"的冲击力）
export const getShowcaseWords = (power: DecipherPower, n: number): Word[] => {
  const byId = new Map(allWords.map(w => [w.id, w]));
  return power.decodableIds
    .map(id => byId.get(id))
    .filter((w): w is Word => !!w)
    .sort((a, b) => b.word.length - a.word.length)
    .slice(0, n);
};
