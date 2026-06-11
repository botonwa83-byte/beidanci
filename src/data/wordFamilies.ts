import {Word} from './types';
import {allWords, suffixes} from './wordDatabase';

// ==================== 派生词家族（带学） ====================
// 记忆规律：派生词共享同一词干，后缀只改词性不改核心义——把家族当一个组块学，
// 学会锚点词后"顺手带走"派生词的记忆成本接近零（扩散激活：回忆锚点会激活全家）。
//
// 索引全自动：词干 + 已知后缀变体（含 e-drop / y→i 拼写调整）拼接后命中词库
// 即建立 base→derived 链，再用并查集合并成家族。

// 后缀变体表：'-tion/-sion' → ['tion', 'sion']，再补主表没列全的常见变体
const EXTRA_SUFFIXES = [
  'ion',
  'ation',
  'ition',
  'ication',
  'ancy',
  'ency',
  'age',
  'ery',
  'ory',
  'en',
  'ish',
  'ship',
  'hood',
  'dom',
  'ality',
  'ization',
];
const suffixVariants: string[] = [...EXTRA_SUFFIXES];
for (const s of suffixes) {
  for (const v of s.suffix.split('/')) {
    const clean = v.trim().replace(/^-+/, '').toLowerCase();
    if (clean && !suffixVariants.includes(clean)) {
      suffixVariants.push(clean);
    }
  }
}

// 语义校验：派生 = 后缀只是衣服、词义没变，所以两词中文释义必须有共同的实义字。
// 这能挡住拼写巧合的误连（rat+ion=ration、miss+ion=mission 词源/词义都不同）
const STOP_CHARS = new Set('的地得者性化人物使有是不在为与和或'.split(''));
const meaningsRelated = (a: Word, b: Word): boolean => {
  const charsA = new Set(
    a.meaning.split('').filter(c => /[一-鿿]/.test(c) && !STOP_CHARS.has(c)),
  );
  for (const c of b.meaning) {
    if (charsA.has(c) && !STOP_CHARS.has(c)) {
      return true;
    }
  }
  return false;
};

// union-find
const parent = new Map<number, number>();
const find = (x: number): number => {
  let r = x;
  while (parent.get(r) !== r) {
    r = parent.get(r)!;
  }
  // path compression
  let c = x;
  while (c !== r) {
    const next = parent.get(c)!;
    parent.set(c, r);
    c = next;
  }
  return r;
};
const union = (a: number, b: number) => {
  const ra = find(a);
  const rb = find(b);
  if (ra !== rb) {
    parent.set(ra, rb);
  }
};

const wordByText = new Map<string, Word>();
for (const w of allWords) {
  parent.set(w.id, w.id);
  const key = w.word.toLowerCase();
  // 同形词保留先出现的（词库内重复极少，影响可忽略）
  if (!wordByText.has(key)) {
    wordByText.set(key, w);
  }
}

// base + 后缀的候选拼写形：直接拼接 / 去尾 e / y→i
const derivedForms = (base: string, suffix: string): string[] => {
  const forms = [base + suffix];
  if (base.endsWith('e')) {
    forms.push(base.slice(0, -1) + suffix);
  }
  if (base.endsWith('y')) {
    forms.push(base.slice(0, -1) + 'i' + suffix);
  }
  return forms;
};

for (const w of allWords) {
  const base = w.word.toLowerCase();
  if (base.length < 3) {
    continue;
  }
  for (const suffix of suffixVariants) {
    for (const form of derivedForms(base, suffix)) {
      const derived = wordByText.get(form);
      if (derived && derived.id !== w.id && meaningsRelated(w, derived)) {
        union(w.id, derived.id);
      }
    }
  }
}

// 家族成员表：id → 同家族其他词（按词长升序，短词通常是锚点）
const familyMembers = new Map<number, Word[]>();
{
  const groups = new Map<number, Word[]>();
  for (const w of allWords) {
    const root = find(w.id);
    const list = groups.get(root);
    if (list) {
      list.push(w);
    } else {
      groups.set(root, [w]);
    }
  }
  for (const group of groups.values()) {
    if (group.length < 2) {
      continue;
    }
    group.sort((a, b) => a.word.length - b.word.length);
    for (const w of group) {
      familyMembers.set(
        w.id,
        group.filter(o => o.id !== w.id),
      );
    }
  }
}

// 锚点词的家族成员（不含自己），无家族返回 []
export const getFamilyWords = (wordId: number): Word[] =>
  familyMembers.get(wordId) || [];

// 家族中还没学过的词，按词长升序（先带短的，记忆负担小）
export const getUnlearnedFamilyWords = (
  wordId: number,
  completedWords: number[],
  limit: number,
): Word[] => {
  const completed = new Set(completedWords);
  return getFamilyWords(wordId)
    .filter(w => !completed.has(w.id))
    .slice(0, limit);
};

// 统计：有家族的词数（自检/展示用）
export const familyCoverage = (): {
  wordsInFamilies: number;
  families: number;
} => {
  const roots = new Set<number>();
  for (const id of familyMembers.keys()) {
    roots.add(find(id));
  }
  return {wordsInFamilies: familyMembers.size, families: roots.size};
};
