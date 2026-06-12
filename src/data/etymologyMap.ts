import type {Word} from './types';
import {allWords, coreRoots, getWordOrigin} from './wordDatabase';
import wordLanguagesData from './wordLanguages.json';

// ==================== 词源版图（词源宇宙·阶段D） ====================
// 每个词标注"进入英语的来源语言"，学过的词点亮对应语言领土——
// "你的词汇 38% 来自拉丁语"。英语是混血儿，这张图就是它的血统证明。
//
// 语言推导链（优先级从高到低）：
//   1. wordLanguages.json 人工标签（哑词主力，规则：取进入英语的直接来源语言）
//   2. wordOrigins.json 身世故事开头的语言名（"古北欧语 vindauga…"）
//   3. rootId → 词根 origin（"拉丁语 portare"）
//   4. morphemes 词根块 origin
// 质量铁律同 wordOrigins：必须真实词源，推不出就留"源头待考"，绝不强标。

export interface LangMeta {
  id: string; // canonical 语言名，同时是 wordLanguages.json 的值
  emoji: string;
  color: string;
  tagline: string; // 一句话领土叙事
}

export const LANG_META: LangMeta[] = [
  {
    id: '拉丁语',
    emoji: '🏛️',
    color: '#C0913B',
    tagline: '罗马帝国的遗产——法律、学术、秩序感全从这来',
  },
  {
    id: '法语',
    emoji: '⚜️',
    color: '#7C5CBF',
    tagline: '1066 年诺曼征服带来的贵族词：宫廷、美食、时尚',
  },
  {
    id: '古英语',
    emoji: '🌾',
    color: '#5E8C4A',
    tagline: '盎格鲁-撒克逊人的本土底色，最日常的词都在这',
  },
  {
    id: '希腊语',
    emoji: '🏺',
    color: '#3E7FBF',
    tagline: '科学与哲学的母语，-logy 和 -phobia 的故乡',
  },
  {
    id: '古北欧语',
    emoji: '⛵',
    color: '#4AA3A3',
    tagline: '维京人登陆留下的礼物：sky、knife、window',
  },
  {
    id: '意大利语',
    emoji: '🎻',
    color: '#C25B4E',
    tagline: '文艺复兴的声音——音乐、艺术、美食词的产地',
  },
  {
    id: '西班牙语',
    emoji: '🌶️',
    color: '#D07A2F',
    tagline: '大航海时代带回的新世界物产',
  },
  {
    id: '阿拉伯语',
    emoji: '🌙',
    color: '#2F8F6B',
    tagline: '中世纪科学与商路：algebra、coffee、sofa',
  },
  {
    id: '荷兰语',
    emoji: '⚓',
    color: '#5A7D9A',
    tagline: '航海民族的船坞词汇',
  },
  {
    id: '德语',
    emoji: '🥨',
    color: '#8A6D3B',
    tagline: '近代科学与生活的邻居借词',
  },
  {
    id: '波斯语',
    emoji: '🪔',
    color: '#A3589A',
    tagline: '丝绸之路西端的古老贡献',
  },
  {
    id: '汉语',
    emoji: '🐉',
    color: '#C23B3B',
    tagline: '从茶到功夫，东方的输出',
  },
  {
    id: '日语',
    emoji: '🗻',
    color: '#D26A8C',
    tagline: '从禅到寿司的现代借词',
  },
  {
    id: '梵语',
    emoji: '🕉️',
    color: '#8A5A2F',
    tagline: '古印度的智慧词根',
  },
  {
    id: '凯尔特语',
    emoji: '☘️',
    color: '#3E8C5F',
    tagline: '不列颠最早居民留下的零星痕迹',
  },
  {
    id: '其他',
    emoji: '🌍',
    color: '#6B7280',
    tagline: '来自世界各个角落的远方词',
  },
];

const META_BY_ID = new Map(LANG_META.map(m => [m.id, m]));

// 文本里检测语言名 → canonical 类别。带"古"的别名必须排在短名前面（古法语 vs 法语）。
const LANG_ALIASES: Array<[string, string]> = [
  ['古法语', '法语'],
  ['古诺斯语', '古北欧语'],
  ['古北欧语', '古北欧语'],
  ['北欧语', '古北欧语'],
  ['古日耳曼语', '古英语'],
  ['日耳曼语', '古英语'],
  ['古英语', '古英语'],
  ['拉丁语', '拉丁语'],
  ['希腊语', '希腊语'],
  ['法语', '法语'],
  ['意大利语', '意大利语'],
  ['西班牙语', '西班牙语'],
  ['葡萄牙语', '其他'],
  ['阿拉伯语', '阿拉伯语'],
  ['荷兰语', '荷兰语'],
  ['德语', '德语'],
  ['波斯语', '波斯语'],
  ['汉语', '汉语'],
  ['日语', '日语'],
  ['梵语', '梵语'],
  ['希伯来语', '其他'],
  ['凯尔特语', '凯尔特语'],
  ['土耳其语', '其他'],
  ['俄语', '其他'],
];

/** 从词源文本里取第一个出现的语言名（文本顺序，即来源链最上游的表述） */
const langFromText = (text: string | null | undefined): string | null => {
  if (!text) {
    return null;
  }
  let best: string | null = null;
  let bestIdx = Infinity;
  for (const [alias, canonical] of LANG_ALIASES) {
    const idx = text.indexOf(alias);
    if (idx >= 0 && idx < bestIdx) {
      // 长别名优先：同位置命中时"古法语"赢过"法语"
      best = canonical;
      bestIdx = idx;
    }
  }
  return best;
};

const manualLangs = wordLanguagesData as Record<string, string>;

const rootOriginById = new Map<string, string>();
for (const r of coreRoots) {
  rootOriginById.set(r.id, r.origin || '');
}

const deriveLanguage = (w: Word): string | null => {
  const manual = manualLangs[w.word.toLowerCase()];
  if (manual && META_BY_ID.has(manual)) {
    return manual;
  }
  const fromStory = langFromText(getWordOrigin(w.word));
  if (fromStory) {
    return fromStory;
  }
  if (w.rootId) {
    const fromRoot = langFromText(rootOriginById.get(w.rootId));
    if (fromRoot) {
      return fromRoot;
    }
  }
  for (const m of w.morphemes || []) {
    if (m.type === 'root') {
      const fromMorpheme = langFromText(m.origin);
      if (fromMorpheme) {
        return fromMorpheme;
      }
    }
  }
  return null;
};

// 全库语言索引：构建时算一次（5876 词毫秒级）
const langByWordId = new Map<number, string>();
const totalByLang = new Map<string, number>();
for (const w of allWords) {
  const lang = deriveLanguage(w);
  if (lang) {
    langByWordId.set(w.id, lang);
    totalByLang.set(lang, (totalByLang.get(lang) || 0) + 1);
  }
}

export const getWordLanguage = (w: Word): string | null =>
  langByWordId.get(w.id) ?? null;

/** 全库可定源词数（用于"全库 X% 已考证"一类口径） */
export const taggedWordCount = langByWordId.size;
export const totalWordCount = allWords.length;

// ==================== 版图统计 ====================

export interface LangTerritory {
  meta: LangMeta;
  totalInDb: number; // 词库里这门语言共多少词
  learned: number; // 用户已点亮多少
  samples: string[]; // 已学样例词（高频优先，最多 3 个）
}

export interface EtymologyMapStats {
  learnedTotal: number; // 已学且在词库中的词数
  learnedTagged: number; // 其中可定源的
  unknownLearned: number; // 源头待考的
  territories: LangTerritory[]; // 已点亮在前（learned 降序→totalInDb 降序）
  topShare: {meta: LangMeta; percent: number} | null; // "你的词汇 38% 拉丁语"
}

const wordById = new Map<number, Word>();
for (const w of allWords) {
  wordById.set(w.id, w);
}

export const computeEtymologyMap = (
  completedWords: number[],
): EtymologyMapStats => {
  const learnedByLang = new Map<string, Word[]>();
  let learnedTotal = 0;
  let learnedTagged = 0;
  for (const id of completedWords) {
    const w = wordById.get(id);
    if (!w) {
      continue;
    }
    learnedTotal++;
    const lang = langByWordId.get(id);
    if (!lang) {
      continue;
    }
    learnedTagged++;
    const list = learnedByLang.get(lang);
    if (list) {
      list.push(w);
    } else {
      learnedByLang.set(lang, [w]);
    }
  }

  const territories: LangTerritory[] = LANG_META.filter(
    m => (totalByLang.get(m.id) || 0) > 0,
  ).map(meta => {
    const learnedWords = (learnedByLang.get(meta.id) || [])
      .slice()
      .sort((a, b) => b.frequency - a.frequency);
    return {
      meta,
      totalInDb: totalByLang.get(meta.id) || 0,
      learned: learnedWords.length,
      samples: learnedWords.slice(0, 3).map(w => w.word),
    };
  });
  territories.sort((a, b) => b.learned - a.learned || b.totalInDb - a.totalInDb);

  const top = territories[0];
  const topShare =
    top && top.learned > 0 && learnedTagged > 0
      ? {
          meta: top.meta,
          percent: Math.round((top.learned / learnedTagged) * 100),
        }
      : null;

  return {
    learnedTotal,
    learnedTagged,
    unknownLearned: learnedTotal - learnedTagged,
    territories,
    topShare,
  };
};

/** 分享文案：混血比例前三 + slogan（RN 自带 Share，零原生依赖） */
export const buildMapShareMessage = (stats: EtymologyMapStats): string => {
  const lit = stats.territories.filter(t => t.learned > 0);
  const top3 = lit
    .slice(0, 3)
    .map(
      t =>
        `${t.meta.emoji} ${t.meta.id} ${Math.round(
          (t.learned / Math.max(stats.learnedTagged, 1)) * 100,
        )}%`,
    )
    .join(' · ');
  return (
    `🗺️ 我的词源版图\n` +
    `已点亮 ${stats.learnedTagged} 个单词的来历，横跨 ${lit.length} 种语言：\n` +
    `${top3}\n\n` +
    `原来英语是个混血儿——没有一个单词是凭空来的。\n` +
    `—— WordPulse 背单词（by King Top）`
  );
};
