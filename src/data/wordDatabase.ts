import {Word, WordRoot, Prefix, Suffix, Level} from './types';
import rawData from './wordDatabaseRaw.json';
import enrichmentData from './wordEnrichment.json';
import rootsExtendedData from './rootsExtended.json';
import {translationService} from '../services/translationService';

const enrichment: Record<
  string,
  {phonetic: string; examples: string[]; exampleTranslations?: string[]}
> = enrichmentData as any;
const extendedRoots = rootsExtendedData.roots;

// === Levels ===
export const levels: Level[] = [
  {
    level: 1,
    name: '入门',
    description: '核心词根 + 高频词',
    targetWords: 100,
    rootsCount: 6,
  },
  {
    level: 2,
    name: '基础',
    description: '扩展词根词缀',
    targetWords: 250,
    rootsCount: 12,
  },
  {
    level: 3,
    name: '进阶',
    description: '中频词根 + 组合词',
    targetWords: 450,
    rootsCount: 18,
  },
  {
    level: 4,
    name: '中级',
    description: '多词素词汇',
    targetWords: 700,
    rootsCount: 24,
  },
  {
    level: 5,
    name: '中高',
    description: '专业词根',
    targetWords: 1000,
    rootsCount: 30,
  },
  {
    level: 6,
    name: '高级',
    description: '综合运用词根词缀',
    targetWords: 1500,
    rootsCount: 40,
  },
  {
    level: 7,
    name: '精通',
    description: '深度词根扩展',
    targetWords: 2200,
    rootsCount: 60,
  },
  {
    level: 8,
    name: '大师',
    description: '全部词汇掌握',
    targetWords: 3272,
    rootsCount: 99,
  },
];

// === Prefixes ===
export const prefixes: Prefix[] = [
  {
    id: 'p_re',
    prefix: 're-',
    meaning: '再次/返回',
    origin: '拉丁语',
    color: '#4ECDC4',
    level: 1,
    examples: ['return', 'repeat', 'review', 'reform', 'reduce'],
  },
  {
    id: 'p_in1',
    prefix: 'in-',
    meaning: '不/向内',
    origin: '拉丁语',
    color: '#FF6B6B',
    level: 1,
    examples: ['incredible', 'import', 'include', 'invest', 'involve'],
  },
  {
    id: 'p_ex',
    prefix: 'ex-',
    meaning: '向外/前任',
    origin: '拉丁语',
    color: '#FFE66D',
    level: 1,
    examples: ['export', 'exit', 'expand', 'explore', 'express'],
  },
  {
    id: 'p_trans',
    prefix: 'trans-',
    meaning: '穿越/转变',
    origin: '拉丁语',
    color: '#A03B82',
    level: 1,
    examples: ['transport', 'transfer', 'transform', 'transmit', 'translate'],
  },
  {
    id: 'p_pre',
    prefix: 'pre-',
    meaning: '在...之前',
    origin: '拉丁语',
    color: '#95E1D3',
    level: 1,
    examples: ['predict', 'prepare', 'prevent', 'present', 'preserve'],
  },
  {
    id: 'p_dis',
    prefix: 'dis-',
    meaning: '否定/分离',
    origin: '拉丁语',
    color: '#DDA0DD',
    level: 2,
    examples: ['disagree', 'discover', 'disappear', 'disrupt', 'dismiss'],
  },
  {
    id: 'p_un',
    prefix: 'un-',
    meaning: '不/相反',
    origin: '古英语',
    color: '#98D8C8',
    level: 2,
    examples: ['unhappy', 'unable', 'unlock', 'unusual', 'uncertain'],
  },
  {
    id: 'p_sub',
    prefix: 'sub-',
    meaning: '在...下面',
    origin: '拉丁语',
    color: '#F7DC6F',
    level: 2,
    examples: ['subway', 'submit', 'subscribe', 'subtract', 'substance'],
  },
  {
    id: 'p_con',
    prefix: 'con-/com-',
    meaning: '共同/一起',
    origin: '拉丁语',
    color: '#85C1E9',
    level: 2,
    examples: ['construct', 'conduct', 'compose', 'connect', 'confirm'],
  },
  {
    id: 'p_de',
    prefix: 'de-',
    meaning: '向下/去除',
    origin: '拉丁语',
    color: '#E59866',
    level: 2,
    examples: ['describe', 'deport', 'decline', 'decrease', 'defend'],
  },
  {
    id: 'p_super',
    prefix: 'super-',
    meaning: '超级/上方',
    origin: '拉丁语',
    color: '#BB8FCE',
    level: 3,
    examples: ['supervise', 'superior', 'superstructure', 'supernatural'],
  },
  {
    id: 'p_inter',
    prefix: 'inter-',
    meaning: '在...之间',
    origin: '拉丁语',
    color: '#85C1E9',
    level: 3,
    examples: [
      'international',
      'internet',
      'interview',
      'interrupt',
      'interact',
    ],
  },
  {
    id: 'p_pro',
    prefix: 'pro-',
    meaning: '向前/支持',
    origin: '拉丁语',
    color: '#73C6B6',
    level: 3,
    examples: ['produce', 'project', 'progress', 'promote', 'prospect'],
  },
  {
    id: 'p_per',
    prefix: 'per-',
    meaning: '完全/贯穿',
    origin: '拉丁语',
    color: '#D4AC6E',
    level: 3,
    examples: ['perfect', 'perform', 'permanent', 'permit', 'persist'],
  },
  {
    id: 'p_ob',
    prefix: 'ob-',
    meaning: '对着/阻碍',
    origin: '拉丁语',
    color: '#CD6155',
    level: 4,
    examples: ['obstruct', 'observe', 'obtain', 'obvious', 'object'],
  },
  {
    id: 'p_ad',
    prefix: 'ad-',
    meaning: '朝向/附加',
    origin: '拉丁语',
    color: '#5DADE2',
    level: 4,
    examples: ['attract', 'admit', 'adapt', 'addict', 'adjust'],
  },
  {
    id: 'p_ab',
    prefix: 'ab-',
    meaning: '离开/偏离',
    origin: '拉丁语',
    color: '#AF7AC5',
    level: 4,
    examples: ['abstract', 'absent', 'absorb', 'abnormal', 'abuse'],
  },
  {
    id: 'p_auto',
    prefix: 'auto-',
    meaning: '自己',
    origin: '希腊语',
    color: '#48C9B0',
    level: 5,
    examples: ['automatic', 'automobile', 'autonomy', 'autograph'],
  },
  {
    id: 'p_tele',
    prefix: 'tele-',
    meaning: '远距离',
    origin: '希腊语',
    color: '#5499C7',
    level: 5,
    examples: ['telephone', 'television', 'telescope', 'telegram'],
  },
  {
    id: 'p_anti',
    prefix: 'anti-',
    meaning: '反对/对抗',
    origin: '希腊语',
    color: '#E74C3C',
    level: 5,
    examples: ['antibiotic', 'antisocial', 'antique', 'anticipate'],
  },
  {
    id: 'p_mis',
    prefix: 'mis-',
    meaning: '错误',
    origin: '古英语',
    color: '#DC7633',
    level: 3,
    examples: ['mistake', 'misunderstand', 'mislead', 'misfortune'],
  },
  {
    id: 'p_over',
    prefix: 'over-',
    meaning: '过度/在上',
    origin: '古英语',
    color: '#7DCEA0',
    level: 3,
    examples: ['overcome', 'overlook', 'overnight', 'overseas'],
  },
  {
    id: 'p_out',
    prefix: 'out-',
    meaning: '超出/向外',
    origin: '古英语',
    color: '#F0B27A',
    level: 4,
    examples: ['outcome', 'outdoor', 'outrage', 'outstanding'],
  },
  {
    id: 'p_under',
    prefix: 'under-',
    meaning: '不足/在下',
    origin: '古英语',
    color: '#AED6F1',
    level: 4,
    examples: ['understand', 'undertake', 'undermine', 'underlying'],
  },
];

// === Suffixes ===
export const suffixes: Suffix[] = [
  {
    id: 's_tion',
    suffix: '-tion/-sion',
    meaning: '行为/状态(名词)',
    origin: '拉丁语',
    color: '#00D4AA',
    level: 1,
    partOfSpeech: 'n.',
    examples: ['action', 'education', 'production', 'expression'],
  },
  {
    id: 's_able',
    suffix: '-able/-ible',
    meaning: '能够...的',
    origin: '拉丁语',
    color: '#2ECC71',
    level: 1,
    partOfSpeech: 'adj.',
    examples: ['readable', 'visible', 'credible', 'portable'],
  },
  {
    id: 's_ment',
    suffix: '-ment',
    meaning: '行为/结果(名词)',
    origin: '拉丁语',
    color: '#3498DB',
    level: 1,
    partOfSpeech: 'n.',
    examples: ['movement', 'development', 'agreement', 'statement'],
  },
  {
    id: 's_ly',
    suffix: '-ly',
    meaning: '副词后缀',
    origin: '古英语',
    color: '#9B59B6',
    level: 1,
    partOfSpeech: 'adv.',
    examples: ['quickly', 'carefully', 'extremely', 'naturally'],
  },
  {
    id: 's_er',
    suffix: '-er/-or',
    meaning: '做...的人/物',
    origin: '古英语',
    color: '#E67E22',
    level: 1,
    partOfSpeech: 'n.',
    examples: ['teacher', 'conductor', 'reporter', 'inspector'],
  },
  {
    id: 's_ness',
    suffix: '-ness',
    meaning: '状态/性质(名词)',
    origin: '古英语',
    color: '#1ABC9C',
    level: 2,
    partOfSpeech: 'n.',
    examples: ['happiness', 'darkness', 'kindness', 'weakness'],
  },
  {
    id: 's_ful',
    suffix: '-ful',
    meaning: '充满...的',
    origin: '古英语',
    color: '#E74C3C',
    level: 2,
    partOfSpeech: 'adj.',
    examples: ['beautiful', 'helpful', 'wonderful', 'powerful'],
  },
  {
    id: 's_less',
    suffix: '-less',
    meaning: '没有...的',
    origin: '古英语',
    color: '#95A5A6',
    level: 2,
    partOfSpeech: 'adj.',
    examples: ['homeless', 'careless', 'endless', 'powerless'],
  },
  {
    id: 's_ive',
    suffix: '-ive/-ative',
    meaning: '有...性质的',
    origin: '拉丁语',
    color: '#F39C12',
    level: 2,
    partOfSpeech: 'adj.',
    examples: ['active', 'creative', 'supportive', 'productive'],
  },
  {
    id: 's_ize',
    suffix: '-ize/-ise',
    meaning: '使成为(动词)',
    origin: '希腊语',
    color: '#8E44AD',
    level: 2,
    partOfSpeech: 'v.',
    examples: ['realize', 'organize', 'recognize', 'memorize'],
  },
  {
    id: 's_al',
    suffix: '-al/-ial',
    meaning: '属于...的',
    origin: '拉丁语',
    color: '#2980B9',
    level: 2,
    partOfSpeech: 'adj.',
    examples: ['natural', 'external', 'personal', 'national'],
  },
  {
    id: 's_ous',
    suffix: '-ous/-ious',
    meaning: '有...特征的',
    origin: '拉丁语',
    color: '#D35400',
    level: 3,
    partOfSpeech: 'adj.',
    examples: ['famous', 'dangerous', 'generous', 'conscious'],
  },
  {
    id: 's_ist',
    suffix: '-ist',
    meaning: '从事...的人',
    origin: '希腊语',
    color: '#C0392B',
    level: 3,
    partOfSpeech: 'n.',
    examples: ['artist', 'scientist', 'specialist', 'economist'],
  },
  {
    id: 's_ity',
    suffix: '-ity/-ty',
    meaning: '性质/状态(名词)',
    origin: '拉丁语',
    color: '#16A085',
    level: 3,
    partOfSpeech: 'n.',
    examples: ['ability', 'quality', 'reality', 'security'],
  },
  {
    id: 's_ence',
    suffix: '-ence/-ance',
    meaning: '状态/行为(名词)',
    origin: '拉丁语',
    color: '#27AE60',
    level: 3,
    partOfSpeech: 'n.',
    examples: ['difference', 'importance', 'presence', 'evidence'],
  },
  {
    id: 's_ate',
    suffix: '-ate',
    meaning: '使...(动词)/有...的',
    origin: '拉丁语',
    color: '#2C3E50',
    level: 3,
    partOfSpeech: 'v./adj.',
    examples: ['create', 'separate', 'accurate', 'generate'],
  },
  {
    id: 's_ure',
    suffix: '-ure',
    meaning: '行为/结果(名词)',
    origin: '拉丁语',
    color: '#7F8C8D',
    level: 4,
    partOfSpeech: 'n.',
    examples: ['structure', 'culture', 'nature', 'manufacture'],
  },
  {
    id: 's_fy',
    suffix: '-fy/-ify',
    meaning: '使成为(动词)',
    origin: '拉丁语',
    color: '#D68910',
    level: 4,
    partOfSpeech: 'v.',
    examples: ['magnify', 'simplify', 'identify', 'classify'],
  },
  {
    id: 's_ent',
    suffix: '-ent/-ant',
    meaning: '正在...的/...者',
    origin: '拉丁语',
    color: '#5B2C6F',
    level: 4,
    partOfSpeech: 'adj./n.',
    examples: ['different', 'important', 'student', 'assistant'],
  },
  {
    id: 's_ic',
    suffix: '-ic/-ical',
    meaning: '属于...的',
    origin: '希腊语',
    color: '#1A5276',
    level: 4,
    partOfSpeech: 'adj.',
    examples: ['automatic', 'economic', 'logical', 'historical'],
  },
];

// === Build word database from raw JSON ===

const posMap: Record<string, string> = {
  v: 'v.',
  n: 'n.',
  a: 'adj.',
  ad: 'adv.',
  prep: 'prep.',
  conj: 'conj.',
  pron: 'pron.',
};

const getPhonetic = (word: string): string => {
  const data = enrichment[word.toLowerCase()];
  return data?.phonetic || '';
};

// Build association stories from morpheme analysis
const buildAssociation = (
  word: string,
  rootMeaning: string,
  rootName: string,
): string => {
  const prefixMatches = prefixes.filter(p => {
    const clean = p.prefix.replace(/[-/].*/g, '');
    return word.startsWith(clean) && clean.length >= 2;
  });

  const suffixMatches = suffixes.filter(s => {
    const variants = s.suffix.replace('-', '').split('/');
    return variants.some(v => word.endsWith(v) && v.length >= 2);
  });

  const parts: string[] = [];
  if (prefixMatches.length > 0) {
    const p = prefixMatches[0];
    parts.push(`${p.prefix.split('/')[0]}(${p.meaning})`);
  }
  parts.push(`${rootName}(${rootMeaning})`);
  if (suffixMatches.length > 0) {
    const s = suffixMatches[0];
    parts.push(`${s.suffix.split('/')[0]}(${s.meaning})`);
  }

  if (parts.length >= 2) {
    return `${word} = ${parts.join(' + ')} → 组合理解：${parts
      .map(p => p.match(/\(([^)]+)\)/)?.[1])
      .filter(Boolean)
      .join(' + ')}`;
  }
  return `${word} 包含词根 ${rootName}(${rootMeaning})，帮助记忆这个词的核心含义。`;
};

// Manual morpheme overrides for words where algorithmic splitting fails
// Format: word -> [{ text, type, meaning, origin, color }]
type MorphemeTuple = [string, 'prefix' | 'root' | 'suffix', string]; // [text, type, meaning_key]
const morphemeOverrides: Record<string, MorphemeTuple[]> = {
  // Compound words - no prefix, just compound + root
  airport: [
    ['air-', 'prefix', '空气/空中'],
    ['port', 'root', ''],
  ],
  passport: [
    ['pass-', 'prefix', '通过'],
    ['port', 'root', ''],
  ],
  sport: [['sport', 'root', '']],
  portfolio: [
    ['port', 'root', ''],
    ['-folio', 'suffix', '页/叶'],
  ],
  proportion: [
    ['pro-', 'prefix', '向前/支持'],
    ['port', 'root', ''],
    ['-ion', 'suffix', '行为/状态(名词)'],
  ],
  opportunity: [
    ['ob-', 'prefix', '朝向'],
    ['port', 'root', ''],
    ['-unity', 'suffix', '状态(名词)'],
  ],
  comport: [
    ['com-', 'prefix', '共同/一起'],
    ['port', 'root', ''],
  ],
  purport: [
    ['pur-', 'prefix', '向前(pro-变体)'],
    ['port', 'root', ''],
  ],
  disport: [
    ['dis-', 'prefix', '分离'],
    ['port', 'root', ''],
  ],
  // struct
  structure: [
    ['struct', 'root', ''],
    ['-ure', 'suffix', '行为/结果(名词)'],
  ],
  restructure: [
    ['re-', 'prefix', '再次/返回'],
    ['struct', 'root', ''],
    ['-ure', 'suffix', '行为/结果(名词)'],
  ],
  superstructure: [
    ['super-', 'prefix', '超级/上方'],
    ['struct', 'root', ''],
    ['-ure', 'suffix', '行为/结果(名词)'],
  ],
  infrastructure: [
    ['infra-', 'prefix', '在...下面'],
    ['struct', 'root', ''],
    ['-ure', 'suffix', '行为/结果(名词)'],
  ],
  // ject
  subject: [
    ['sub-', 'prefix', '在...下面'],
    ['ject', 'root', ''],
  ],
  object: [
    ['ob-', 'prefix', '对着/阻碍'],
    ['ject', 'root', ''],
  ],
  adjective: [
    ['ad-', 'prefix', '朝向/附加'],
    ['ject', 'root', ''],
    ['-ive', 'suffix', '有...性质的'],
  ],
  // rupt
  abrupt: [
    ['ab-', 'prefix', '离开/偏离'],
    ['rupt', 'root', ''],
  ],
  bankrupt: [
    ['bank-', 'prefix', '银行/柜台'],
    ['rupt', 'root', ''],
  ],
  corrupt: [
    ['cor-', 'prefix', '共同(con-变体)'],
    ['rupt', 'root', ''],
  ],
  // dict
  dictionary: [
    ['dict', 'root', ''],
    ['-ionary', 'suffix', '与...有关的(名词)'],
  ],
  verdict: [
    ['ver-', 'prefix', '真实'],
    ['dict', 'root', ''],
  ],
  // spect
  spectrum: [
    ['spect', 'root', ''],
    ['-rum', 'suffix', '(名词后缀)'],
  ],
  speculate: [
    ['spec', 'root', ''],
    ['-ulate', 'suffix', '使...(动词)'],
  ],
  // vis/vid
  visual: [
    ['vis', 'root', ''],
    ['-ual', 'suffix', '属于...的'],
  ],
  visualize: [
    ['vis', 'root', ''],
    ['-ual', 'suffix', '属于...的'],
    ['-ize', 'suffix', '使成为(动词)'],
  ],
  television: [
    ['tele-', 'prefix', '远距离'],
    ['vis', 'root', ''],
    ['-ion', 'suffix', '行为/状态(名词)'],
  ],
  // voc/vok
  voice: [
    ['voc', 'root', ''],
    ['-e', 'suffix', ''],
  ],
  vocation: [
    ['voc', 'root', ''],
    ['-ation', 'suffix', '行为/状态(名词)'],
  ],
  // misc compound words
  understand: [
    ['under-', 'prefix', '不足/在下'],
    ['stand', 'root', ''],
  ],
  outstanding: [
    ['out-', 'prefix', '超出/向外'],
    ['stand', 'root', ''],
    ['-ing', 'suffix', '正在...的'],
  ],
  withstand: [
    ['with-', 'prefix', '对抗'],
    ['stand', 'root', ''],
  ],
  circumstance: [
    ['circum-', 'prefix', '周围'],
    ['st', 'root', ''],
    ['-ance', 'suffix', '状态/行为(名词)'],
  ],
  telephone: [
    ['tele-', 'prefix', '远距离'],
    ['phon', 'root', ''],
    ['-e', 'suffix', ''],
  ],
  microphone: [
    ['micro-', 'prefix', '小/微'],
    ['phon', 'root', ''],
    ['-e', 'suffix', ''],
  ],
  mediterranean: [
    ['medi-', 'prefix', '中间'],
    ['terr', 'root', ''],
    ['-anean', 'suffix', '属于...的'],
  ],
  automobile: [
    ['auto-', 'prefix', '自己'],
    ['mob', 'root', ''],
    ['-ile', 'suffix', '能够...的'],
  ],
  semiconductor: [
    ['semi-', 'prefix', '半'],
    ['con-', 'prefix', '共同/一起'],
    ['duct', 'root', ''],
    ['-or', 'suffix', '做...的人/物'],
  ],
};

// Build morphemes for a word
const buildMorphemes = (
  word: string,
  rootId: string,
  rootMeaning: string,
  rootColor: string,
  rootOrigin: string,
) => {
  type MorphemeResult = {
    text: string;
    type: 'prefix' | 'root' | 'suffix';
    meaning: string;
    origin: string;
    color: string;
  };
  const lowerWord = word.toLowerCase();

  // Check manual overrides first
  const override = morphemeOverrides[lowerWord];
  if (override) {
    return override.map(([text, type, meaning]) => ({
      text,
      type,
      meaning: type === 'root' ? rootMeaning : meaning,
      origin: type === 'root' ? rootOrigin : '',
      color:
        type === 'root'
          ? rootColor
          : type === 'prefix'
          ? prefixes.find(p =>
              text.replace('-', '').startsWith(p.prefix.replace(/[-/].*/g, '')),
            )?.color || '#888888'
          : suffixes.find(s => {
              const variants = s.suffix.replace('-', '').split('/');
              return variants.some(v =>
                text.replace('-', '').endsWith(v.replace('-', '')),
              );
            })?.color || '#888888',
    })) as MorphemeResult[];
  }

  const morphemes: MorphemeResult[] = [];
  let remaining = lowerWord;

  // Check prefix - only match if root is clearly present after removing prefix
  const sortedPrefixes = [...prefixes].sort((a, b) => {
    const aLen = a.prefix.replace(/[-/].*/g, '').length;
    const bLen = b.prefix.replace(/[-/].*/g, '').length;
    return bLen - aLen;
  });

  for (const p of sortedPrefixes) {
    const variants = p.prefix
      .replace('-', '')
      .split('/')
      .map(v => v.replace('-', ''));
    for (const v of variants) {
      if (remaining.startsWith(v) && remaining.length > v.length + 1) {
        const afterPrefix = remaining.slice(v.length);
        if (
          afterPrefix.startsWith(rootId) ||
          afterPrefix.slice(0, 1) +
            afterPrefix.slice(1).startsWith(rootId.slice(1))
        ) {
          morphemes.push({
            text: v + '-',
            type: 'prefix',
            meaning: p.meaning,
            origin: p.origin,
            color: p.color,
          });
          remaining = afterPrefix;
          break;
        }
      }
    }
    if (morphemes.length > 0) {
      break;
    }
  }

  // Check suffix
  const sortedSuffixes = [...suffixes].sort((a, b) => {
    const aLen = a.suffix.replace(/[-/].*/g, '').length;
    const bLen = b.suffix.replace(/[-/].*/g, '').length;
    return bLen - aLen;
  });

  let suffixMatch: (typeof suffixes)[0] | null = null;
  let suffixVariant = '';
  for (const s of sortedSuffixes) {
    const variants = s.suffix
      .replace('-', '')
      .split('/')
      .map(v => v.replace('-', ''));
    for (const v of variants) {
      if (remaining.endsWith(v) && remaining.length > v.length) {
        const beforeSuffix = remaining.slice(0, remaining.length - v.length);
        if (
          beforeSuffix.includes(rootId) ||
          beforeSuffix.endsWith(rootId) ||
          (beforeSuffix.length >= rootId.length - 1 &&
            beforeSuffix.length <= rootId.length + 2)
        ) {
          suffixMatch = s;
          suffixVariant = v;
          break;
        }
      }
    }
    if (suffixMatch) {
      break;
    }
  }

  // Add root
  morphemes.push({
    text: rootId,
    type: 'root',
    meaning: rootMeaning,
    origin: rootOrigin,
    color: rootColor,
  });

  // Add suffix
  if (suffixMatch) {
    morphemes.push({
      text: '-' + suffixVariant,
      type: 'suffix',
      meaning: suffixMatch.meaning,
      origin: suffixMatch.origin,
      color: suffixMatch.color,
    });
  }

  return morphemes;
};

// Extended morpheme overrides with better coverage
const extendedMorphemeOverrides: Record<
  string,
  {
    text: string;
    type: 'prefix' | 'root' | 'suffix';
    meaning: string;
    origin: string;
    color: string;
  }[]
> = {
  transport: [
    {
      text: 'trans-',
      type: 'prefix',
      meaning: '穿越/转变',
      origin: '拉丁语',
      color: '#A03B82',
    },
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
  ],
  export: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
  ],
  import: [
    {
      text: 'im-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
  ],
  support: [
    {
      text: 'sup-',
      type: 'prefix',
      meaning: '在...下面',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
  ],
  report: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
  ],
  construct: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'struct',
      type: 'root',
      meaning: '建造，构建',
      origin: '拉丁语 struere',
      color: '#3498DB',
    },
  ],
  instruct: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'struct',
      type: 'root',
      meaning: '建造，构建',
      origin: '拉丁语 struere',
      color: '#3498DB',
    },
  ],
  destruct: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'struct',
      type: 'root',
      meaning: '建造，构建',
      origin: '拉丁语 struere',
      color: '#3498DB',
    },
  ],
  obstruct: [
    {
      text: 'ob-',
      type: 'prefix',
      meaning: '对着/阻碍',
      origin: '拉丁语',
      color: '#CD6155',
    },
    {
      text: 'struct',
      type: 'root',
      meaning: '建造，构建',
      origin: '拉丁语 struere',
      color: '#3498DB',
    },
  ],
  inspect: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'spect',
      type: 'root',
      meaning: '看，观察',
      origin: '拉丁语 spectare',
      color: '#2ECC71',
    },
  ],
  respect: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'spect',
      type: 'root',
      meaning: '看，观察',
      origin: '拉丁语 spectare',
      color: '#2ECC71',
    },
  ],
  expect: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'spect',
      type: 'root',
      meaning: '看，观察',
      origin: '拉丁语 spectare',
      color: '#2ECC71',
    },
  ],
  prospect: [
    {
      text: 'pro-',
      type: 'prefix',
      meaning: '向前/支持',
      origin: '拉丁语',
      color: '#73C6B6',
    },
    {
      text: 'spect',
      type: 'root',
      meaning: '看，观察',
      origin: '拉丁语 spectare',
      color: '#2ECC71',
    },
  ],
  project: [
    {
      text: 'pro-',
      type: 'prefix',
      meaning: '向前/支持',
      origin: '拉丁语',
      color: '#73C6B6',
    },
    {
      text: 'ject',
      type: 'root',
      meaning: '投掷，扔',
      origin: '拉丁语 jacere',
      color: '#9B59B6',
    },
  ],
  inject: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'ject',
      type: 'root',
      meaning: '投掷，扔',
      origin: '拉丁语 jacere',
      color: '#9B59B6',
    },
  ],
  reject: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'ject',
      type: 'root',
      meaning: '投掷，扔',
      origin: '拉丁语 jacere',
      color: '#9B59B6',
    },
  ],
  predict: [
    {
      text: 'pre-',
      type: 'prefix',
      meaning: '在...之前',
      origin: '拉丁语',
      color: '#95E1D3',
    },
    {
      text: 'dict',
      type: 'root',
      meaning: '说，言',
      origin: '拉丁语 dicere',
      color: '#F39C12',
    },
  ],
  contradict: [
    {
      text: 'contra-',
      type: 'prefix',
      meaning: '相反/反对',
      origin: '拉丁语',
      color: '#E74C3C',
    },
    {
      text: 'dict',
      type: 'root',
      meaning: '说，言',
      origin: '拉丁语 dicere',
      color: '#F39C12',
    },
  ],
  visible: [
    {
      text: 'vis',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {
      text: '-ible',
      type: 'suffix',
      meaning: '能够...的',
      origin: '拉丁语',
      color: '#2ECC71',
    },
  ],
  vision: [
    {
      text: 'vis',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  supervise: [
    {
      text: 'super-',
      type: 'prefix',
      meaning: '超级/上方',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'vis',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  conduct: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'duct',
      type: 'root',
      meaning: '引导，带领',
      origin: '拉丁语 ducere',
      color: '#2980B9',
    },
  ],
  produce: [
    {
      text: 'pro-',
      type: 'prefix',
      meaning: '向前/支持',
      origin: '拉丁语',
      color: '#73C6B6',
    },
    {
      text: 'duce',
      type: 'root',
      meaning: '引导，带领',
      origin: '拉丁语 ducere',
      color: '#2980B9',
    },
  ],
  reduce: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'duce',
      type: 'root',
      meaning: '引导，带领',
      origin: '拉丁语 ducere',
      color: '#2980B9',
    },
  ],
  introduce: [
    {
      text: 'intro-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'duce',
      type: 'root',
      meaning: '引导，带领',
      origin: '拉丁语 ducere',
      color: '#2980B9',
    },
  ],
  reform: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'form',
      type: 'root',
      meaning: '形状，形式',
      origin: '拉丁语 forma',
      color: '#E67E22',
    },
  ],
  transform: [
    {
      text: 'trans-',
      type: 'prefix',
      meaning: '穿越/转变',
      origin: '拉丁语',
      color: '#A03B82',
    },
    {
      text: 'form',
      type: 'root',
      meaning: '形状，形式',
      origin: '拉丁语 forma',
      color: '#E67E22',
    },
  ],
  inform: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'form',
      type: 'root',
      meaning: '形状，形式',
      origin: '拉丁语 forma',
      color: '#E67E22',
    },
  ],
  perform: [
    {
      text: 'per-',
      type: 'prefix',
      meaning: '完全/贯穿',
      origin: '拉丁语',
      color: '#D4AC6E',
    },
    {
      text: 'form',
      type: 'root',
      meaning: '形状，形式',
      origin: '拉丁语 forma',
      color: '#E67E22',
    },
  ],
  attract: [
    {
      text: 'at-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'tract',
      type: 'root',
      meaning: '拉，拖',
      origin: '拉丁语 trahere',
      color: '#95A5A6',
    },
  ],
  extract: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'tract',
      type: 'root',
      meaning: '拉，拖',
      origin: '拉丁语 trahere',
      color: '#95A5A6',
    },
  ],
  contract: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'tract',
      type: 'root',
      meaning: '拉，拖',
      origin: '拉丁语 trahere',
      color: '#95A5A6',
    },
  ],
  distract: [
    {
      text: 'dis-',
      type: 'prefix',
      meaning: '否定/分离',
      origin: '拉丁语',
      color: '#DDA0DD',
    },
    {
      text: 'tract',
      type: 'root',
      meaning: '拉，拖',
      origin: '拉丁语 trahere',
      color: '#95A5A6',
    },
  ],
  interrupt: [
    {
      text: 'inter-',
      type: 'prefix',
      meaning: '在...之间',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'rupt',
      type: 'root',
      meaning: '破裂，断裂',
      origin: '拉丁语 rumpere',
      color: '#D35400',
    },
  ],
  describe: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'scrib',
      type: 'root',
      meaning: '写',
      origin: '拉丁语 scribere',
      color: '#8E44AD',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  subscribe: [
    {
      text: 'sub-',
      type: 'prefix',
      meaning: '在...下面',
      origin: '拉丁语',
      color: '#F7DC6F',
    },
    {
      text: 'scrib',
      type: 'root',
      meaning: '写',
      origin: '拉丁语 scribere',
      color: '#8E44AD',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  prescribe: [
    {
      text: 'pre-',
      type: 'prefix',
      meaning: '在...之前',
      origin: '拉丁语',
      color: '#95E1D3',
    },
    {
      text: 'scrib',
      type: 'root',
      meaning: '写',
      origin: '拉丁语 scribere',
      color: '#8E44AD',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  transmit: [
    {
      text: 'trans-',
      type: 'prefix',
      meaning: '穿越/转变',
      origin: '拉丁语',
      color: '#A03B82',
    },
    {
      text: 'mit',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
  ],
  permit: [
    {
      text: 'per-',
      type: 'prefix',
      meaning: '完全/贯穿',
      origin: '拉丁语',
      color: '#D4AC6E',
    },
    {
      text: 'mit',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
  ],
  submit: [
    {
      text: 'sub-',
      type: 'prefix',
      meaning: '在...下面',
      origin: '拉丁语',
      color: '#F7DC6F',
    },
    {
      text: 'mit',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
  ],
  commit: [
    {
      text: 'com-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'mit',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
  ],
  position: [
    {
      text: 'pos',
      type: 'root',
      meaning: '放置',
      origin: '拉丁语 ponere',
      color: '#C0392B',
    },
    {
      text: '-ition',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  compose: [
    {
      text: 'com-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'pose',
      type: 'root',
      meaning: '放置',
      origin: '拉丁语 ponere',
      color: '#C0392B',
    },
  ],
  dispose: [
    {
      text: 'dis-',
      type: 'prefix',
      meaning: '否定/分离',
      origin: '拉丁语',
      color: '#DDA0DD',
    },
    {
      text: 'pose',
      type: 'root',
      meaning: '放置',
      origin: '拉丁语 ponere',
      color: '#C0392B',
    },
  ],
  expose: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'pose',
      type: 'root',
      meaning: '放置',
      origin: '拉丁语 ponere',
      color: '#C0392B',
    },
  ],
  credit: [
    {
      text: 'cred',
      type: 'root',
      meaning: '相信',
      origin: '拉丁语 credere',
      color: '#27AE60',
    },
    {
      text: '-it',
      type: 'suffix',
      meaning: '(名词后缀)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  credible: [
    {
      text: 'cred',
      type: 'root',
      meaning: '相信',
      origin: '拉丁语 credere',
      color: '#27AE60',
    },
    {
      text: '-ible',
      type: 'suffix',
      meaning: '能够...的',
      origin: '拉丁语',
      color: '#2ECC71',
    },
  ],
  incredible: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '不/向内',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'cred',
      type: 'root',
      meaning: '相信',
      origin: '拉丁语 credere',
      color: '#27AE60',
    },
    {
      text: '-ible',
      type: 'suffix',
      meaning: '能够...的',
      origin: '拉丁语',
      color: '#2ECC71',
    },
  ],
  memory: [
    {
      text: 'mem',
      type: 'root',
      meaning: '记忆',
      origin: '拉丁语 memor',
      color: '#F1C40F',
    },
    {
      text: '-ory',
      type: 'suffix',
      meaning: '与...有关的(名词)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  remember: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'mem',
      type: 'root',
      meaning: '记忆',
      origin: '拉丁语 memor',
      color: '#F1C40F',
    },
    {text: '-ber', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  photograph: [
    {
      text: 'photo-',
      type: 'prefix',
      meaning: '光',
      origin: '希腊语',
      color: '#F39C12',
    },
    {
      text: 'graph',
      type: 'root',
      meaning: '写，画',
      origin: '希腊语 graphein',
      color: '#8B4513',
    },
  ],
  telegraph: [
    {
      text: 'tele-',
      type: 'prefix',
      meaning: '远距离',
      origin: '希腊语',
      color: '#5499C7',
    },
    {
      text: 'graph',
      type: 'root',
      meaning: '写，画',
      origin: '希腊语 graphein',
      color: '#8B4513',
    },
  ],
  biography: [
    {
      text: 'bio-',
      type: 'prefix',
      meaning: '生命',
      origin: '希腊语',
      color: '#27AE60',
    },
    {
      text: 'graph',
      type: 'root',
      meaning: '写，画',
      origin: '希腊语 graphein',
      color: '#8B4513',
    },
    {
      text: '-y',
      type: 'suffix',
      meaning: '状态(名词)',
      origin: '希腊语',
      color: '#888888',
    },
  ],
  biology: [
    {
      text: 'bio-',
      type: 'prefix',
      meaning: '生命',
      origin: '希腊语',
      color: '#27AE60',
    },
    {
      text: '-ology',
      type: 'suffix',
      meaning: '...学',
      origin: '希腊语',
      color: '#17A589',
    },
  ],
  psychology: [
    {
      text: 'psycho-',
      type: 'prefix',
      meaning: '心灵',
      origin: '希腊语',
      color: '#9B59B6',
    },
    {
      text: '-ology',
      type: 'suffix',
      meaning: '...学',
      origin: '希腊语',
      color: '#17A589',
    },
  ],
  technology: [
    {
      text: 'techno-',
      type: 'prefix',
      meaning: '技术',
      origin: '希腊语',
      color: '#3498DB',
    },
    {
      text: '-ology',
      type: 'suffix',
      meaning: '...学',
      origin: '希腊语',
      color: '#17A589',
    },
  ],
  convert: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'vert',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
  ],
  revert: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'vert',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
  ],
  divert: [
    {
      text: 'di-',
      type: 'prefix',
      meaning: '分开/二',
      origin: '拉丁语',
      color: '#E74C3C',
    },
    {
      text: 'vert',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
  ],
  invert: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'vert',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
  ],
  reverse: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'vers',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  universe: [
    {
      text: 'uni-',
      type: 'prefix',
      meaning: '一/单一',
      origin: '拉丁语',
      color: '#9B59B6',
    },
    {
      text: 'vers',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  accept: [
    {
      text: 'ac-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'cept',
      type: 'root',
      meaning: '抓住，接受',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
  ],
  except: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'cept',
      type: 'root',
      meaning: '抓住，接受',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
  ],
  concept: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'cept',
      type: 'root',
      meaning: '抓住，接受',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
  ],
  receive: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'ceive',
      type: 'root',
      meaning: '抓住，接受',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
  ],
  perceive: [
    {
      text: 'per-',
      type: 'prefix',
      meaning: '完全/贯穿',
      origin: '拉丁语',
      color: '#D4AC6E',
    },
    {
      text: 'ceive',
      type: 'root',
      meaning: '抓住，接受',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
  ],
  sense: [
    {
      text: 'sens',
      type: 'root',
      meaning: '感觉',
      origin: '拉丁语 sentire',
      color: '#6C5CE7',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  sensitive: [
    {
      text: 'sens',
      type: 'root',
      meaning: '感觉',
      origin: '拉丁语 sentire',
      color: '#6C5CE7',
    },
    {
      text: '-itive',
      type: 'suffix',
      meaning: '有...性质的',
      origin: '拉丁语',
      color: '#F39C12',
    },
  ],
  depend: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'pend',
      type: 'root',
      meaning: '悬挂，称重',
      origin: '拉丁语 pendere',
      color: '#00CEC9',
    },
  ],
  suspend: [
    {
      text: 'sus-',
      type: 'prefix',
      meaning: '在...下面',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'pend',
      type: 'root',
      meaning: '悬挂，称重',
      origin: '拉丁语 pendere',
      color: '#00CEC9',
    },
  ],
  extend: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'tend',
      type: 'root',
      meaning: '拉伸，趋向',
      origin: '拉丁语 tendere',
      color: '#DDA0DD',
    },
  ],
  intend: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'tend',
      type: 'root',
      meaning: '拉伸，趋向',
      origin: '拉丁语 tendere',
      color: '#DDA0DD',
    },
  ],
  attend: [
    {
      text: 'at-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'tend',
      type: 'root',
      meaning: '拉伸，趋向',
      origin: '拉丁语 tendere',
      color: '#DDA0DD',
    },
  ],
  event: [
    {
      text: 'e-',
      type: 'prefix',
      meaning: '向外/出来',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'vent',
      type: 'root',
      meaning: '来',
      origin: '拉丁语 venire',
      color: '#FF7F50',
    },
  ],
  prevent: [
    {
      text: 'pre-',
      type: 'prefix',
      meaning: '在...之前',
      origin: '拉丁语',
      color: '#95E1D3',
    },
    {
      text: 'vent',
      type: 'root',
      meaning: '来',
      origin: '拉丁语 venire',
      color: '#FF7F50',
    },
  ],
  invent: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'vent',
      type: 'root',
      meaning: '来',
      origin: '拉丁语 venire',
      color: '#FF7F50',
    },
  ],
  perfect: [
    {
      text: 'per-',
      type: 'prefix',
      meaning: '完全/贯穿',
      origin: '拉丁语',
      color: '#D4AC6E',
    },
    {
      text: 'fect',
      type: 'root',
      meaning: '做，制作',
      origin: '拉丁语 facere',
      color: '#20B2AA',
    },
  ],
  effect: [
    {
      text: 'ef-',
      type: 'prefix',
      meaning: '向外/出来',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'fect',
      type: 'root',
      meaning: '做，制作',
      origin: '拉丁语 facere',
      color: '#20B2AA',
    },
  ],
  transfer: [
    {
      text: 'trans-',
      type: 'prefix',
      meaning: '穿越/转变',
      origin: '拉丁语',
      color: '#A03B82',
    },
    {
      text: 'fer',
      type: 'root',
      meaning: '带来，携带',
      origin: '拉丁语 ferre',
      color: '#FF69B4',
    },
  ],
  refer: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'fer',
      type: 'root',
      meaning: '带来，携带',
      origin: '拉丁语 ferre',
      color: '#FF69B4',
    },
  ],
  prefer: [
    {
      text: 'pre-',
      type: 'prefix',
      meaning: '在...之前',
      origin: '拉丁语',
      color: '#95E1D3',
    },
    {
      text: 'fer',
      type: 'root',
      meaning: '带来，携带',
      origin: '拉丁语 ferre',
      color: '#FF69B4',
    },
  ],
  motion: [
    {
      text: 'mot',
      type: 'root',
      meaning: '移动',
      origin: '拉丁语 movere',
      color: '#9370DB',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  motor: [
    {
      text: 'mot',
      type: 'root',
      meaning: '移动',
      origin: '拉丁语 movere',
      color: '#9370DB',
    },
    {
      text: '-or',
      type: 'suffix',
      meaning: '做...的人/物',
      origin: '拉丁语',
      color: '#E67E22',
    },
  ],
  promote: [
    {
      text: 'pro-',
      type: 'prefix',
      meaning: '向前/支持',
      origin: '拉丁语',
      color: '#73C6B6',
    },
    {
      text: 'mote',
      type: 'root',
      meaning: '移动',
      origin: '拉丁语 movere',
      color: '#9370DB',
    },
  ],
  compel: [
    {
      text: 'com-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'pel',
      type: 'root',
      meaning: '推，驱使',
      origin: '拉丁语 pellere',
      color: '#87CEEB',
    },
  ],
  expel: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'pel',
      type: 'root',
      meaning: '推，驱使',
      origin: '拉丁语 pellere',
      color: '#87CEEB',
    },
  ],
  repel: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'pel',
      type: 'root',
      meaning: '推，驱使',
      origin: '拉丁语 pellere',
      color: '#87CEEB',
    },
  ],
  claim: [
    {
      text: 'claim',
      type: 'root',
      meaning: '喊叫',
      origin: '拉丁语 clamare',
      color: '#CD853F',
    },
  ],
  exclaim: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'claim',
      type: 'root',
      meaning: '喊叫',
      origin: '拉丁语 clamare',
      color: '#CD853F',
    },
  ],
  proclaim: [
    {
      text: 'pro-',
      type: 'prefix',
      meaning: '向前/支持',
      origin: '拉丁语',
      color: '#73C6B6',
    },
    {
      text: 'claim',
      type: 'root',
      meaning: '喊叫',
      origin: '拉丁语 clamare',
      color: '#CD853F',
    },
  ],
  clarify: [
    {
      text: 'clar',
      type: 'root',
      meaning: '清楚，明白',
      origin: '拉丁语 clarus',
      color: '#F4A460',
    },
    {
      text: '-ify',
      type: 'suffix',
      meaning: '使成为(动词)',
      origin: '拉丁语',
      color: '#D68910',
    },
  ],
  declare: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'clare',
      type: 'root',
      meaning: '清楚，明白',
      origin: '拉丁语 clarus',
      color: '#F4A460',
    },
  ],
  mortal: [
    {
      text: 'mort',
      type: 'root',
      meaning: '死亡',
      origin: '拉丁语 mors',
      color: '#708090',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  immortal: [
    {
      text: 'im-',
      type: 'prefix',
      meaning: '不/向内',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'mort',
      type: 'root',
      meaning: '死亡',
      origin: '拉丁语 mors',
      color: '#708090',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  vital: [
    {
      text: 'vit',
      type: 'root',
      meaning: '生命',
      origin: '拉丁语 vita',
      color: '#32CD32',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  vivid: [
    {
      text: 'viv',
      type: 'root',
      meaning: '生命，活',
      origin: '拉丁语 vivere',
      color: '#32CD32',
    },
    {
      text: '-id',
      type: 'suffix',
      meaning: '有...特征的',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  survive: [
    {
      text: 'sur-',
      type: 'prefix',
      meaning: '在...上面',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'vive',
      type: 'root',
      meaning: '生命，活',
      origin: '拉丁语 vivere',
      color: '#32CD32',
    },
  ],
  audio: [
    {
      text: 'aud',
      type: 'root',
      meaning: '听',
      origin: '拉丁语 audire',
      color: '#4169E1',
    },
    {
      text: '-io',
      type: 'suffix',
      meaning: '(名词后缀)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  audience: [
    {
      text: 'aud',
      type: 'root',
      meaning: '听',
      origin: '拉丁语 audire',
      color: '#4169E1',
    },
    {
      text: '-ience',
      type: 'suffix',
      meaning: '状态/行为(名词)',
      origin: '拉丁语',
      color: '#27AE60',
    },
  ],
  telescope: [
    {
      text: 'tele-',
      type: 'prefix',
      meaning: '远距离',
      origin: '希腊语',
      color: '#5499C7',
    },
    {
      text: 'scope',
      type: 'root',
      meaning: '看，观察',
      origin: '希腊语 skopein',
      color: '#00CED1',
    },
  ],
  microscope: [
    {
      text: 'micro-',
      type: 'prefix',
      meaning: '小/微',
      origin: '希腊语',
      color: '#7DCEA0',
    },
    {
      text: 'scope',
      type: 'root',
      meaning: '看，观察',
      origin: '希腊语 skopein',
      color: '#00CED1',
    },
  ],
  chronic: [
    {
      text: 'chron',
      type: 'root',
      meaning: '时间',
      origin: '希腊语 chronos',
      color: '#DAA520',
    },
    {
      text: '-ic',
      type: 'suffix',
      meaning: '属于...的',
      origin: '希腊语',
      color: '#1A5276',
    },
  ],
  geography: [
    {
      text: 'geo-',
      type: 'prefix',
      meaning: '地球，土地',
      origin: '希腊语',
      color: '#228B22',
    },
    {
      text: 'graph',
      type: 'root',
      meaning: '写，画',
      origin: '希腊语 graphein',
      color: '#8B4513',
    },
    {
      text: '-y',
      type: 'suffix',
      meaning: '状态(名词)',
      origin: '希腊语',
      color: '#888888',
    },
  ],
  geology: [
    {
      text: 'geo-',
      type: 'prefix',
      meaning: '地球，土地',
      origin: '希腊语',
      color: '#228B22',
    },
    {
      text: '-ology',
      type: 'suffix',
      meaning: '...学',
      origin: '希腊语',
      color: '#17A589',
    },
  ],
  hydrogen: [
    {
      text: 'hydr-',
      type: 'prefix',
      meaning: '水',
      origin: '希腊语',
      color: '#1E90FF',
    },
    {
      text: '-gen',
      type: 'suffix',
      meaning: '产生，种类',
      origin: '希腊语',
      color: '#E67E22',
    },
  ],
  sympathy: [
    {
      text: 'sym-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '希腊语',
      color: '#85C1E9',
    },
    {
      text: 'pathy',
      type: 'root',
      meaning: '感情，疾病',
      origin: '希腊语 pathos',
      color: '#DC143C',
    },
  ],
  empathy: [
    {
      text: 'em-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '希腊语',
      color: '#FF6B6B',
    },
    {
      text: 'pathy',
      type: 'root',
      meaning: '感情，疾病',
      origin: '希腊语 pathos',
      color: '#DC143C',
    },
  ],
  manual: [
    {
      text: 'manu',
      type: 'root',
      meaning: '手',
      origin: '拉丁语 manus',
      color: '#D2691E',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  manufacture: [
    {
      text: 'manu',
      type: 'root',
      meaning: '手',
      origin: '拉丁语 manus',
      color: '#D2691E',
    },
    {
      text: 'fact',
      type: 'root',
      meaning: '做，制作',
      origin: '拉丁语 facere',
      color: '#20B2AA',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  international: [
    {
      text: 'inter-',
      type: 'prefix',
      meaning: '在...之间',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'nation',
      type: 'root',
      meaning: '国家',
      origin: '拉丁语 natio',
      color: '#7D3C98',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  national: [
    {
      text: 'nation',
      type: 'root',
      meaning: '国家',
      origin: '拉丁语 natio',
      color: '#7D3C98',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  nationality: [
    {
      text: 'nation',
      type: 'root',
      meaning: '国家',
      origin: '拉丁语 natio',
      color: '#7D3C98',
    },
    {
      text: '-ality',
      type: 'suffix',
      meaning: '性质/状态(名词)',
      origin: '拉丁语',
      color: '#16A085',
    },
  ],
  natural: [
    {
      text: 'nat',
      type: 'root',
      meaning: '出生',
      origin: '拉丁语 nasci',
      color: '#7D3C98',
    },
    {
      text: '-ural',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  nature: [
    {
      text: 'nat',
      type: 'root',
      meaning: '出生',
      origin: '拉丁语 nasci',
      color: '#7D3C98',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  education: [
    {
      text: 'e-',
      type: 'prefix',
      meaning: '向外/出来',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'duc',
      type: 'root',
      meaning: '引导，带领',
      origin: '拉丁语 ducere',
      color: '#2980B9',
    },
    {
      text: '-ation',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  educate: [
    {
      text: 'e-',
      type: 'prefix',
      meaning: '向外/出来',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'duc',
      type: 'root',
      meaning: '引导，带领',
      origin: '拉丁语 ducere',
      color: '#2980B9',
    },
    {
      text: '-ate',
      type: 'suffix',
      meaning: '使...(动词)',
      origin: '拉丁语',
      color: '#2C3E50',
    },
  ],
  development: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'velop',
      type: 'root',
      meaning: '包裹',
      origin: '古法语 voloper',
      color: '#E67E22',
    },
    {
      text: '-ment',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#3498DB',
    },
  ],
  develop: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'velop',
      type: 'root',
      meaning: '包裹',
      origin: '古法语 voloper',
      color: '#E67E22',
    },
  ],
  information: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'form',
      type: 'root',
      meaning: '形状，形式',
      origin: '拉丁语 forma',
      color: '#E67E22',
    },
    {
      text: '-ation',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  knowledge: [
    {
      text: 'know',
      type: 'root',
      meaning: '知道',
      origin: '古英语 cnawan',
      color: '#27AE60',
    },
    {
      text: '-ledge',
      type: 'suffix',
      meaning: '(名词后缀)',
      origin: '古英语',
      color: '#888888',
    },
  ],
  understanding: [
    {
      text: 'under-',
      type: 'prefix',
      meaning: '不足/在下',
      origin: '古英语',
      color: '#AED6F1',
    },
    {
      text: 'stand',
      type: 'root',
      meaning: '站立',
      origin: '古英语 standan',
      color: '#8B4513',
    },
    {
      text: '-ing',
      type: 'suffix',
      meaning: '正在...的/名词化',
      origin: '古英语',
      color: '#888888',
    },
  ],
  television: [
    {
      text: 'tele-',
      type: 'prefix',
      meaning: '远距离',
      origin: '希腊语',
      color: '#5499C7',
    },
    {
      text: 'vis',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  telephone: [
    {
      text: 'tele-',
      type: 'prefix',
      meaning: '远距离',
      origin: '希腊语',
      color: '#5499C7',
    },
    {
      text: 'phon',
      type: 'root',
      meaning: '声音',
      origin: '希腊语 phone',
      color: '#7D3C98',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  photography: [
    {
      text: 'photo-',
      type: 'prefix',
      meaning: '光',
      origin: '希腊语',
      color: '#F39C12',
    },
    {
      text: 'graph',
      type: 'root',
      meaning: '写，画',
      origin: '希腊语 graphein',
      color: '#8B4513',
    },
    {
      text: '-y',
      type: 'suffix',
      meaning: '状态(名词)',
      origin: '希腊语',
      color: '#888888',
    },
  ],
  automatic: [
    {
      text: 'auto-',
      type: 'prefix',
      meaning: '自己',
      origin: '希腊语',
      color: '#48C9B0',
    },
    {
      text: 'mat',
      type: 'root',
      meaning: '思考/行动',
      origin: '希腊语 matos',
      color: '#1ABC9C',
    },
    {
      text: '-ic',
      type: 'suffix',
      meaning: '属于...的',
      origin: '希腊语',
      color: '#1A5276',
    },
  ],
  automobile: [
    {
      text: 'auto-',
      type: 'prefix',
      meaning: '自己',
      origin: '希腊语',
      color: '#48C9B0',
    },
    {
      text: 'mob',
      type: 'root',
      meaning: '移动',
      origin: '拉丁语 mobilis',
      color: '#9370DB',
    },
    {
      text: '-ile',
      type: 'suffix',
      meaning: '能够...的',
      origin: '拉丁语',
      color: '#2ECC71',
    },
  ],
  history: [
    {
      text: 'hist',
      type: 'root',
      meaning: '知识/研究',
      origin: '希腊语 historia',
      color: '#CD853F',
    },
    {
      text: '-ory',
      type: 'suffix',
      meaning: '与...有关的(名词)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  historical: [
    {
      text: 'hist',
      type: 'root',
      meaning: '知识/研究',
      origin: '希腊语 historia',
      color: '#CD853F',
    },
    {
      text: '-orical',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#1A5276',
    },
  ],
  personal: [
    {
      text: 'person',
      type: 'root',
      meaning: '人',
      origin: '拉丁语 persona',
      color: '#2980B9',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  personality: [
    {
      text: 'person',
      type: 'root',
      meaning: '人',
      origin: '拉丁语 persona',
      color: '#2980B9',
    },
    {
      text: '-ality',
      type: 'suffix',
      meaning: '性质/状态(名词)',
      origin: '拉丁语',
      color: '#16A085',
    },
  ],
  important: [
    {
      text: 'im-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
    {
      text: '-ant',
      type: 'suffix',
      meaning: '正在...的/...者',
      origin: '拉丁语',
      color: '#5B2C6F',
    },
  ],
  impossible: [
    {
      text: 'im-',
      type: 'prefix',
      meaning: '不/向内',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'poss',
      type: 'root',
      meaning: '能够',
      origin: '拉丁语 posse',
      color: '#C0392B',
    },
    {
      text: '-ible',
      type: 'suffix',
      meaning: '能够...的',
      origin: '拉丁语',
      color: '#2ECC71',
    },
  ],
  possible: [
    {
      text: 'poss',
      type: 'root',
      meaning: '能够',
      origin: '拉丁语 posse',
      color: '#C0392B',
    },
    {
      text: '-ible',
      type: 'suffix',
      meaning: '能够...的',
      origin: '拉丁语',
      color: '#2ECC71',
    },
  ],
  necessary: [
    {
      text: 'ne-',
      type: 'prefix',
      meaning: '不',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'cess',
      type: 'root',
      meaning: '走，步',
      origin: '拉丁语 cedere',
      color: '#D35400',
    },
    {
      text: '-ary',
      type: 'suffix',
      meaning: '与...有关的(形容词)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  opportunity: [
    {
      text: 'op-',
      type: 'prefix',
      meaning: '朝向',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
    {
      text: '-unity',
      type: 'suffix',
      meaning: '状态(名词)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  experience: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'peri-',
      type: 'prefix',
      meaning: '通过',
      origin: '希腊语',
      color: '#D4AC6E',
    },
    {
      text: 'ence',
      type: 'root',
      meaning: '状态',
      origin: '拉丁语',
      color: '#27AE60',
    },
  ],
  experiment: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'peri-',
      type: 'prefix',
      meaning: '通过',
      origin: '希腊语',
      color: '#D4AC6E',
    },
    {
      text: 'ment',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#3498DB',
    },
  ],
  environment: [
    {
      text: 'en-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'viron',
      type: 'root',
      meaning: '环绕',
      origin: '古法语 virer',
      color: '#2980B9',
    },
    {
      text: '-ment',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#3498DB',
    },
  ],
  government: [
    {
      text: 'govern',
      type: 'root',
      meaning: '统治',
      origin: '拉丁语 gubernare',
      color: '#E67E22',
    },
    {
      text: '-ment',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#3498DB',
    },
  ],
  governmental: [
    {
      text: 'govern',
      type: 'root',
      meaning: '统治',
      origin: '拉丁语 gubernare',
      color: '#E67E22',
    },
    {
      text: '-mental',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  administration: [
    {
      text: 'ad-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'ministr',
      type: 'root',
      meaning: '服务',
      origin: '拉丁语 minister',
      color: '#27AE60',
    },
    {
      text: '-ation',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  communication: [
    {
      text: 'com-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'mun',
      type: 'root',
      meaning: '服务/交换',
      origin: '拉丁语 munus',
      color: '#27AE60',
    },
    {
      text: '-ication',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  communicate: [
    {
      text: 'com-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'mun',
      type: 'root',
      meaning: '服务/交换',
      origin: '拉丁语 munus',
      color: '#27AE60',
    },
    {
      text: '-icate',
      type: 'suffix',
      meaning: '使...(动词)',
      origin: '拉丁语',
      color: '#2C3E50',
    },
  ],
  economy: [
    {
      text: 'eco-',
      type: 'prefix',
      meaning: '家庭/环境',
      origin: '希腊语',
      color: '#27AE60',
    },
    {
      text: 'nom',
      type: 'root',
      meaning: '管理/法则',
      origin: '希腊语 nomos',
      color: '#17A589',
    },
    {
      text: '-y',
      type: 'suffix',
      meaning: '状态(名词)',
      origin: '希腊语',
      color: '#888888',
    },
  ],
  economic: [
    {
      text: 'eco-',
      type: 'prefix',
      meaning: '家庭/环境',
      origin: '希腊语',
      color: '#27AE60',
    },
    {
      text: 'nom',
      type: 'root',
      meaning: '管理/法则',
      origin: '希腊语 nomos',
      color: '#17A589',
    },
    {
      text: '-ic',
      type: 'suffix',
      meaning: '属于...的',
      origin: '希腊语',
      color: '#1A5276',
    },
  ],
  economical: [
    {
      text: 'eco-',
      type: 'prefix',
      meaning: '家庭/环境',
      origin: '希腊语',
      color: '#27AE60',
    },
    {
      text: 'nom',
      type: 'root',
      meaning: '管理/法则',
      origin: '希腊语 nomos',
      color: '#17A589',
    },
    {
      text: '-ical',
      type: 'suffix',
      meaning: '属于...的',
      origin: '希腊语',
      color: '#1A5276',
    },
  ],
  culture: [
    {
      text: 'cult',
      type: 'root',
      meaning: '耕种/培育',
      origin: '拉丁语 colere',
      color: '#27AE60',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  cultural: [
    {
      text: 'cult',
      type: 'root',
      meaning: '耕种/培育',
      origin: '拉丁语 colere',
      color: '#27AE60',
    },
    {
      text: '-ural',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  agriculture: [
    {
      text: 'agri-',
      type: 'prefix',
      meaning: '田地',
      origin: '拉丁语',
      color: '#228B22',
    },
    {
      text: 'cult',
      type: 'root',
      meaning: '耕种/培育',
      origin: '拉丁语 colere',
      color: '#27AE60',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  industrial: [
    {
      text: 'industri',
      type: 'root',
      meaning: '勤奋',
      origin: '拉丁语 industria',
      color: '#E67E22',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  industry: [
    {
      text: 'industri',
      type: 'root',
      meaning: '勤奋',
      origin: '拉丁语 industria',
      color: '#E67E22',
    },
    {
      text: '-y',
      type: 'suffix',
      meaning: '状态(名词)',
      origin: '希腊语',
      color: '#888888',
    },
  ],
  business: [
    {
      text: 'busy',
      type: 'root',
      meaning: '忙碌',
      origin: '古英语 bisig',
      color: '#E67E22',
    },
    {
      text: '-ness',
      type: 'suffix',
      meaning: '状态/性质(名词)',
      origin: '古英语',
      color: '#1ABC9C',
    },
  ],
  successful: [
    {
      text: 'suc-',
      type: 'prefix',
      meaning: '在...下面',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'cess',
      type: 'root',
      meaning: '走，步',
      origin: '拉丁语 cedere',
      color: '#D35400',
    },
    {
      text: '-ful',
      type: 'suffix',
      meaning: '充满...的',
      origin: '古英语',
      color: '#E74C3C',
    },
  ],
  success: [
    {
      text: 'suc-',
      type: 'prefix',
      meaning: '在...下面',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'cess',
      type: 'root',
      meaning: '走，步',
      origin: '拉丁语 cedere',
      color: '#D35400',
    },
  ],
  // === 补充更多高频词根单词 ===
  // port 词根
  portable: [
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
    {
      text: '-able',
      type: 'suffix',
      meaning: '能够...的',
      origin: '拉丁语',
      color: '#2ECC71',
    },
  ],
  deport: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
  ],
  portrait: [
    {
      text: 'port',
      type: 'root',
      meaning: '携带，运送',
      origin: '拉丁语 portare',
      color: '#E74C3C',
    },
    {
      text: '-rait',
      type: 'suffix',
      meaning: '(名词后缀)',
      origin: '古法语',
      color: '#888888',
    },
  ],
  // struct 词根
  structure: [
    {
      text: 'struct',
      type: 'root',
      meaning: '建造，构建',
      origin: '拉丁语 struere',
      color: '#3498DB',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  reconstruct: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'struct',
      type: 'root',
      meaning: '建造，构建',
      origin: '拉丁语 struere',
      color: '#3498DB',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  infrastructure: [
    {
      text: 'infra-',
      type: 'prefix',
      meaning: '在...下面',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'struct',
      type: 'root',
      meaning: '建造，构建',
      origin: '拉丁语 struere',
      color: '#3498DB',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  superstructure: [
    {
      text: 'super-',
      type: 'prefix',
      meaning: '超级/上方',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'struct',
      type: 'root',
      meaning: '建造，构建',
      origin: '拉丁语 struere',
      color: '#3498DB',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  // spect 词根
  spectacle: [
    {
      text: 'spect',
      type: 'root',
      meaning: '看，观察',
      origin: '拉丁语 spectare',
      color: '#2ECC71',
    },
    {
      text: '-acle',
      type: 'suffix',
      meaning: '(名词后缀)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  spectrum: [
    {
      text: 'spect',
      type: 'root',
      meaning: '看，观察',
      origin: '拉丁语 spectare',
      color: '#2ECC71',
    },
    {
      text: '-rum',
      type: 'suffix',
      meaning: '(名词后缀)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  speculate: [
    {
      text: 'spec',
      type: 'root',
      meaning: '看，观察',
      origin: '拉丁语 spectare',
      color: '#2ECC71',
    },
    {
      text: '-ulate',
      type: 'suffix',
      meaning: '使...(动词)',
      origin: '拉丁语',
      color: '#D68910',
    },
  ],
  perspective: [
    {
      text: 'per-',
      type: 'prefix',
      meaning: '完全/贯穿',
      origin: '拉丁语',
      color: '#D4AC6E',
    },
    {
      text: 'spect',
      type: 'root',
      meaning: '看，观察',
      origin: '拉丁语 spectare',
      color: '#2ECC71',
    },
    {
      text: '-ive',
      type: 'suffix',
      meaning: '有...性质的',
      origin: '拉丁语',
      color: '#F39C12',
    },
  ],
  // ject 词根
  eject: [
    {
      text: 'e-',
      type: 'prefix',
      meaning: '向外/出来',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'ject',
      type: 'root',
      meaning: '投掷，扔',
      origin: '拉丁语 jacere',
      color: '#9B59B6',
    },
  ],
  conjecture: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'ject',
      type: 'root',
      meaning: '投掷，扔',
      origin: '拉丁语 jacere',
      color: '#9B59B6',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  abject: [
    {
      text: 'ab-',
      type: 'prefix',
      meaning: '离开/偏离',
      origin: '拉丁语',
      color: '#AF7AC5',
    },
    {
      text: 'ject',
      type: 'root',
      meaning: '投掷，扔',
      origin: '拉丁语 jacere',
      color: '#9B59B6',
    },
  ],
  // dict 词根
  dictate: [
    {
      text: 'dict',
      type: 'root',
      meaning: '说，言',
      origin: '拉丁语 dicere',
      color: '#F39C12',
    },
    {
      text: '-ate',
      type: 'suffix',
      meaning: '使...(动词)',
      origin: '拉丁语',
      color: '#2C3E50',
    },
  ],
  addict: [
    {
      text: 'ad-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'dict',
      type: 'root',
      meaning: '说，言',
      origin: '拉丁语 dicere',
      color: '#F39C12',
    },
  ],
  dedicate: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'dic',
      type: 'root',
      meaning: '说，言',
      origin: '拉丁语 dicere',
      color: '#F39C12',
    },
    {
      text: '-ate',
      type: 'suffix',
      meaning: '使...(动词)',
      origin: '拉丁语',
      color: '#2C3E50',
    },
  ],
  indicate: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'dic',
      type: 'root',
      meaning: '说，言',
      origin: '拉丁语 dicere',
      color: '#F39C12',
    },
    {
      text: '-ate',
      type: 'suffix',
      meaning: '使...(动词)',
      origin: '拉丁语',
      color: '#2C3E50',
    },
  ],
  // vis 词根
  visit: [
    {
      text: 'vis',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {
      text: '-it',
      type: 'suffix',
      meaning: '(动词后缀)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  visual: [
    {
      text: 'vis',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {
      text: '-ual',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  revise: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'vis',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  visualize: [
    {
      text: 'vis',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {
      text: '-ual',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
    {
      text: '-ize',
      type: 'suffix',
      meaning: '使成为(动词)',
      origin: '希腊语',
      color: '#8E44AD',
    },
  ],
  // vid 词根
  video: [
    {
      text: 'vid',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {
      text: '-eo',
      type: 'suffix',
      meaning: '(名词后缀)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  evidence: [
    {
      text: 'e-',
      type: 'prefix',
      meaning: '向外/出来',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'vid',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {
      text: '-ence',
      type: 'suffix',
      meaning: '状态/行为(名词)',
      origin: '拉丁语',
      color: '#27AE60',
    },
  ],
  provide: [
    {
      text: 'pro-',
      type: 'prefix',
      meaning: '向前/支持',
      origin: '拉丁语',
      color: '#73C6B6',
    },
    {
      text: 'vid',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  divide: [
    {
      text: 'di-',
      type: 'prefix',
      meaning: '分开/二',
      origin: '拉丁语',
      color: '#E74C3C',
    },
    {
      text: 'vid',
      type: 'root',
      meaning: '看',
      origin: '拉丁语 videre',
      color: '#1ABC9C',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  individual: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '不/向内',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'divid',
      type: 'root',
      meaning: '分开',
      origin: '拉丁语 dividere',
      color: '#1ABC9C',
    },
    {
      text: '-ual',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  // duct 词根
  deduce: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'duce',
      type: 'root',
      meaning: '引导，带领',
      origin: '拉丁语 ducere',
      color: '#2980B9',
    },
  ],
  reproduce: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'produce',
      type: 'root',
      meaning: '生产',
      origin: '拉丁语 producere',
      color: '#2980B9',
    },
  ],
  semiconductor: [
    {
      text: 'semi-',
      type: 'prefix',
      meaning: '半',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'duct',
      type: 'root',
      meaning: '引导，带领',
      origin: '拉丁语 ducere',
      color: '#2980B9',
    },
    {
      text: '-or',
      type: 'suffix',
      meaning: '做...的人/物',
      origin: '拉丁语',
      color: '#E67E22',
    },
  ],
  // form 词根
  uniform: [
    {
      text: 'uni-',
      type: 'prefix',
      meaning: '一/单一',
      origin: '拉丁语',
      color: '#9B59B6',
    },
    {
      text: 'form',
      type: 'root',
      meaning: '形状，形式',
      origin: '拉丁语 forma',
      color: '#E67E22',
    },
  ],
  formal: [
    {
      text: 'form',
      type: 'root',
      meaning: '形状，形式',
      origin: '拉丁语 forma',
      color: '#E67E22',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  formation: [
    {
      text: 'form',
      type: 'root',
      meaning: '形状，形式',
      origin: '拉丁语 forma',
      color: '#E67E22',
    },
    {
      text: '-ation',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  formula: [
    {
      text: 'form',
      type: 'root',
      meaning: '形状，形式',
      origin: '拉丁语 forma',
      color: '#E67E22',
    },
    {
      text: '-ula',
      type: 'suffix',
      meaning: '(名词后缀)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  // tract 词根
  abstract: [
    {
      text: 'abs-',
      type: 'prefix',
      meaning: '离开/偏离',
      origin: '拉丁语',
      color: '#AF7AC5',
    },
    {
      text: 'tract',
      type: 'root',
      meaning: '拉，拖',
      origin: '拉丁语 trahere',
      color: '#95A5A6',
    },
  ],
  subtract: [
    {
      text: 'sub-',
      type: 'prefix',
      meaning: '在...下面',
      origin: '拉丁语',
      color: '#F7DC6F',
    },
    {
      text: 'tract',
      type: 'root',
      meaning: '拉，拖',
      origin: '拉丁语 trahere',
      color: '#95A5A6',
    },
  ],
  tractor: [
    {
      text: 'tract',
      type: 'root',
      meaning: '拉，拖',
      origin: '拉丁语 trahere',
      color: '#95A5A6',
    },
    {
      text: '-or',
      type: 'suffix',
      meaning: '做...的人/物',
      origin: '拉丁语',
      color: '#E67E22',
    },
  ],
  // rupt 词根
  disrupt: [
    {
      text: 'dis-',
      type: 'prefix',
      meaning: '否定/分离',
      origin: '拉丁语',
      color: '#DDA0DD',
    },
    {
      text: 'rupt',
      type: 'root',
      meaning: '破裂，断裂',
      origin: '拉丁语 rumpere',
      color: '#D35400',
    },
  ],
  erupt: [
    {
      text: 'e-',
      type: 'prefix',
      meaning: '向外/出来',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'rupt',
      type: 'root',
      meaning: '破裂，断裂',
      origin: '拉丁语 rumpere',
      color: '#D35400',
    },
  ],
  rupture: [
    {
      text: 'rupt',
      type: 'root',
      meaning: '破裂，断裂',
      origin: '拉丁语 rumpere',
      color: '#D35400',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  // mit/miss 词根
  admit: [
    {
      text: 'ad-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'mit',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
  ],
  emit: [
    {
      text: 'e-',
      type: 'prefix',
      meaning: '向外/出来',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'mit',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
  ],
  remit: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'mit',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
  ],
  mission: [
    {
      text: 'miss',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  dismiss: [
    {
      text: 'dis-',
      type: 'prefix',
      meaning: '否定/分离',
      origin: '拉丁语',
      color: '#DDA0DD',
    },
    {
      text: 'miss',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
  ],
  permission: [
    {
      text: 'per-',
      type: 'prefix',
      meaning: '完全/贯穿',
      origin: '拉丁语',
      color: '#D4AC6E',
    },
    {
      text: 'miss',
      type: 'root',
      meaning: '发送，放',
      origin: '拉丁语 mittere',
      color: '#16A085',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  // pos 词根
  propose: [
    {
      text: 'pro-',
      type: 'prefix',
      meaning: '向前/支持',
      origin: '拉丁语',
      color: '#73C6B6',
    },
    {
      text: 'pose',
      type: 'root',
      meaning: '放置',
      origin: '拉丁语 ponere',
      color: '#C0392B',
    },
  ],
  oppose: [
    {
      text: 'op-',
      type: 'prefix',
      meaning: '对着/反对',
      origin: '拉丁语',
      color: '#CD6155',
    },
    {
      text: 'pose',
      type: 'root',
      meaning: '放置',
      origin: '拉丁语 ponere',
      color: '#C0392B',
    },
  ],
  deposit: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'posit',
      type: 'root',
      meaning: '放置',
      origin: '拉丁语 ponere',
      color: '#C0392B',
    },
  ],
  // cred 词根
  credential: [
    {
      text: 'cred',
      type: 'root',
      meaning: '相信',
      origin: '拉丁语 credere',
      color: '#27AE60',
    },
    {
      text: '-ential',
      type: 'suffix',
      meaning: '与...有关的',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  accredit: [
    {
      text: 'ac-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'cred',
      type: 'root',
      meaning: '相信',
      origin: '拉丁语 credere',
      color: '#27AE60',
    },
    {
      text: '-it',
      type: 'suffix',
      meaning: '(动词后缀)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  // mem 词根
  memorial: [
    {
      text: 'mem',
      type: 'root',
      meaning: '记忆',
      origin: '拉丁语 memor',
      color: '#F1C40F',
    },
    {
      text: '-orial',
      type: 'suffix',
      meaning: '与...有关的(形容词)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  memorize: [
    {
      text: 'mem',
      type: 'root',
      meaning: '记忆',
      origin: '拉丁语 memor',
      color: '#F1C40F',
    },
    {
      text: '-orize',
      type: 'suffix',
      meaning: '使成为(动词)',
      origin: '希腊语',
      color: '#8E44AD',
    },
  ],
  // fer 词根
  infer: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'fer',
      type: 'root',
      meaning: '带来，携带',
      origin: '拉丁语 ferre',
      color: '#FF69B4',
    },
  ],
  confer: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'fer',
      type: 'root',
      meaning: '带来，携带',
      origin: '拉丁语 ferre',
      color: '#FF69B4',
    },
  ],
  differ: [
    {
      text: 'dif-',
      type: 'prefix',
      meaning: '分开/否定',
      origin: '拉丁语',
      color: '#E74C3C',
    },
    {
      text: 'fer',
      type: 'root',
      meaning: '带来，携带',
      origin: '拉丁语 ferre',
      color: '#FF69B4',
    },
  ],
  suffer: [
    {
      text: 'suf-',
      type: 'prefix',
      meaning: '在...下面',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'fer',
      type: 'root',
      meaning: '带来，携带',
      origin: '拉丁语 ferre',
      color: '#FF69B4',
    },
  ],
  offer: [
    {
      text: 'of-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'fer',
      type: 'root',
      meaning: '带来，携带',
      origin: '拉丁语 ferre',
      color: '#FF69B4',
    },
  ],
  // vent/ven 词根
  adventure: [
    {
      text: 'ad-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'vent',
      type: 'root',
      meaning: '来',
      origin: '拉丁语 venire',
      color: '#FF7F50',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  convention: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'vent',
      type: 'root',
      meaning: '来',
      origin: '拉丁语 venire',
      color: '#FF7F50',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  controversy: [
    {
      text: 'contro-',
      type: 'prefix',
      meaning: '相反/反对',
      origin: '拉丁语',
      color: '#E74C3C',
    },
    {
      text: 'vers',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
    {
      text: '-y',
      type: 'suffix',
      meaning: '状态(名词)',
      origin: '希腊语',
      color: '#888888',
    },
  ],
  // fac/fect 词根
  factory: [
    {
      text: 'fact',
      type: 'root',
      meaning: '做，制作',
      origin: '拉丁语 facere',
      color: '#20B2AA',
    },
    {
      text: '-ory',
      type: 'suffix',
      meaning: '与...有关的(名词)',
      origin: '拉丁语',
      color: '#888888',
    },
  ],
  facility: [
    {
      text: 'fac',
      type: 'root',
      meaning: '做，制作',
      origin: '拉丁语 facere',
      color: '#20B2AA',
    },
    {
      text: '-ility',
      type: 'suffix',
      meaning: '性质/状态(名词)',
      origin: '拉丁语',
      color: '#16A085',
    },
  ],
  infect: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'fect',
      type: 'root',
      meaning: '做，制作',
      origin: '拉丁语 facere',
      color: '#20B2AA',
    },
  ],
  reflect: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'flect',
      type: 'root',
      meaning: '弯曲',
      origin: '拉丁语 flectere',
      color: '#20B2AA',
    },
  ],
  select: [
    {
      text: 'se-',
      type: 'prefix',
      meaning: '分开',
      origin: '拉丁语',
      color: '#BB8FCE',
    },
    {
      text: 'lect',
      type: 'root',
      meaning: '选择，收集',
      origin: '拉丁语 legere',
      color: '#20B2AA',
    },
  ],
  // mot/mov 词根
  remote: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'mot',
      type: 'root',
      meaning: '移动',
      origin: '拉丁语 movere',
      color: '#9370DB',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  emotion: [
    {
      text: 'e-',
      type: 'prefix',
      meaning: '向外/出来',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'mot',
      type: 'root',
      meaning: '移动',
      origin: '拉丁语 movere',
      color: '#9370DB',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  movement: [
    {
      text: 'move',
      type: 'root',
      meaning: '移动',
      origin: '拉丁语 movere',
      color: '#9370DB',
    },
    {
      text: '-ment',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#3498DB',
    },
  ],
  remove: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'move',
      type: 'root',
      meaning: '移动',
      origin: '拉丁语 movere',
      color: '#9370DB',
    },
  ],
  improve: [
    {
      text: 'im-',
      type: 'prefix',
      meaning: '不/向内',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'prove',
      type: 'root',
      meaning: '证明，测试',
      origin: '拉丁语 probare',
      color: '#9370DB',
    },
  ],
  // sens/sent 词根
  sensible: [
    {
      text: 'sens',
      type: 'root',
      meaning: '感觉',
      origin: '拉丁语 sentire',
      color: '#6C5CE7',
    },
    {
      text: '-ible',
      type: 'suffix',
      meaning: '能够...的',
      origin: '拉丁语',
      color: '#2ECC71',
    },
  ],
  sensation: [
    {
      text: 'sens',
      type: 'root',
      meaning: '感觉',
      origin: '拉丁语 sentire',
      color: '#6C5CE7',
    },
    {
      text: '-ation',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  consent: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'sent',
      type: 'root',
      meaning: '感觉，发送',
      origin: '拉丁语 sentire',
      color: '#6C5CE7',
    },
  ],
  resent: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'sent',
      type: 'root',
      meaning: '感觉，发送',
      origin: '拉丁语 sentire',
      color: '#6C5CE7',
    },
  ],
  sentence: [
    {
      text: 'sent',
      type: 'root',
      meaning: '感觉，发送',
      origin: '拉丁语 sentire',
      color: '#6C5CE7',
    },
    {
      text: '-ence',
      type: 'suffix',
      meaning: '状态/行为(名词)',
      origin: '拉丁语',
      color: '#27AE60',
    },
  ],
  sentiment: [
    {
      text: 'sent',
      type: 'root',
      meaning: '感觉，发送',
      origin: '拉丁语 sentire',
      color: '#6C5CE7',
    },
    {
      text: '-iment',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#3498DB',
    },
  ],
  // pend/pens 词根
  append: [
    {
      text: 'ap-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'pend',
      type: 'root',
      meaning: '悬挂，称重',
      origin: '拉丁语 pendere',
      color: '#00CEC9',
    },
  ],
  independent: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '不/向内',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'pend',
      type: 'root',
      meaning: '悬挂，称重',
      origin: '拉丁语 pendere',
      color: '#00CEC9',
    },
    {
      text: '-ent',
      type: 'suffix',
      meaning: '正在...的/...者',
      origin: '拉丁语',
      color: '#5B2C6F',
    },
  ],
  expend: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'pend',
      type: 'root',
      meaning: '悬挂，称重',
      origin: '拉丁语 pendere',
      color: '#00CEC9',
    },
  ],
  expense: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'pens',
      type: 'root',
      meaning: '悬挂，称重',
      origin: '拉丁语 pendere',
      color: '#00CEC9',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  // tend/tens 词根
  pretend: [
    {
      text: 'pre-',
      type: 'prefix',
      meaning: '在...之前',
      origin: '拉丁语',
      color: '#95E1D3',
    },
    {
      text: 'tend',
      type: 'root',
      meaning: '拉伸，趋向',
      origin: '拉丁语 tendere',
      color: '#DDA0DD',
    },
  ],
  contend: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'tend',
      type: 'root',
      meaning: '拉伸，趋向',
      origin: '拉丁语 tendere',
      color: '#DDA0DD',
    },
  ],
  tense: [
    {
      text: 'tens',
      type: 'root',
      meaning: '拉伸，紧张',
      origin: '拉丁语 tendere',
      color: '#DDA0DD',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  tension: [
    {
      text: 'tens',
      type: 'root',
      meaning: '拉伸，紧张',
      origin: '拉丁语 tendere',
      color: '#DDA0DD',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  intense: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'tens',
      type: 'root',
      meaning: '拉伸，紧张',
      origin: '拉丁语 tendere',
      color: '#DDA0DD',
    },
    {text: '-e', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  extensive: [
    {
      text: 'ex-',
      type: 'prefix',
      meaning: '向外/前任',
      origin: '拉丁语',
      color: '#FFE66D',
    },
    {
      text: 'tens',
      type: 'root',
      meaning: '拉伸，紧张',
      origin: '拉丁语 tendere',
      color: '#DDA0DD',
    },
    {
      text: '-ive',
      type: 'suffix',
      meaning: '有...性质的',
      origin: '拉丁语',
      color: '#F39C12',
    },
  ],
  // cept/ceiv 词根
  intercept: [
    {
      text: 'inter-',
      type: 'prefix',
      meaning: '在...之间',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'cept',
      type: 'root',
      meaning: '抓住，接受',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
  ],
  receptive: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'cept',
      type: 'root',
      meaning: '抓住，接受',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
    {
      text: '-ive',
      type: 'suffix',
      meaning: '有...性质的',
      origin: '拉丁语',
      color: '#F39C12',
    },
  ],
  deceive: [
    {
      text: 'de-',
      type: 'prefix',
      meaning: '向下/去除',
      origin: '拉丁语',
      color: '#E59866',
    },
    {
      text: 'ceive',
      type: 'root',
      meaning: '抓住，接受',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
  ],
  conceive: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'ceive',
      type: 'root',
      meaning: '抓住，接受',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
  ],
  achieve: [
    {
      text: 'a-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'chieve',
      type: 'root',
      meaning: '完成',
      origin: '拉丁语 capere',
      color: '#EB4D4B',
    },
  ],
  // vert/vers 词根
  advertise: [
    {
      text: 'ad-',
      type: 'prefix',
      meaning: '朝向/附加',
      origin: '拉丁语',
      color: '#5DADE2',
    },
    {
      text: 'vert',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
    {
      text: '-ise',
      type: 'suffix',
      meaning: '使成为(动词)',
      origin: '希腊语',
      color: '#8E44AD',
    },
  ],
  vertical: [
    {
      text: 'vert',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
    {
      text: '-ical',
      type: 'suffix',
      meaning: '属于...的',
      origin: '希腊语',
      color: '#1A5276',
    },
  ],
  reversible: [
    {
      text: 're-',
      type: 'prefix',
      meaning: '再次/返回',
      origin: '拉丁语',
      color: '#4ECDC4',
    },
    {
      text: 'vers',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
    {
      text: '-ible',
      type: 'suffix',
      meaning: '能够...的',
      origin: '拉丁语',
      color: '#2ECC71',
    },
  ],
  version: [
    {
      text: 'vers',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  diverse: [
    {
      text: 'di-',
      type: 'prefix',
      meaning: '分开/二',
      origin: '拉丁语',
      color: '#E74C3C',
    },
    {
      text: 'verse',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
  ],
  converse: [
    {
      text: 'con-',
      type: 'prefix',
      meaning: '共同/一起',
      origin: '拉丁语',
      color: '#85C1E9',
    },
    {
      text: 'verse',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
  ],
  universal: [
    {
      text: 'uni-',
      type: 'prefix',
      meaning: '一/单一',
      origin: '拉丁语',
      color: '#9B59B6',
    },
    {
      text: 'vers',
      type: 'root',
      meaning: '转',
      origin: '拉丁语 vertere',
      color: '#F0932B',
    },
    {
      text: '-al',
      type: 'suffix',
      meaning: '属于...的',
      origin: '拉丁语',
      color: '#2980B9',
    },
  ],
  // pel/pul 词根
  propel: [
    {
      text: 'pro-',
      type: 'prefix',
      meaning: '向前/支持',
      origin: '拉丁语',
      color: '#73C6B6',
    },
    {
      text: 'pel',
      type: 'root',
      meaning: '推，驱使',
      origin: '拉丁语 pellere',
      color: '#87CEEB',
    },
  ],
  impel: [
    {
      text: 'im-',
      type: 'prefix',
      meaning: '不/向内',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'pel',
      type: 'root',
      meaning: '推，驱使',
      origin: '拉丁语 pellere',
      color: '#87CEEB',
    },
  ],
  dispel: [
    {
      text: 'dis-',
      type: 'prefix',
      meaning: '否定/分离',
      origin: '拉丁语',
      color: '#DDA0DD',
    },
    {
      text: 'pel',
      type: 'root',
      meaning: '推，驱使',
      origin: '拉丁语 pellere',
      color: '#87CEEB',
    },
  ],
  pulse: [
    {
      text: 'pul',
      type: 'root',
      meaning: '推，驱使',
      origin: '拉丁语 pellere',
      color: '#87CEEB',
    },
    {text: '-se', type: 'suffix', meaning: '', origin: '', color: '#888888'},
  ],
  // 其他常用词
  invention: [
    {
      text: 'in-',
      type: 'prefix',
      meaning: '向内/进入',
      origin: '拉丁语',
      color: '#FF6B6B',
    },
    {
      text: 'vent',
      type: 'root',
      meaning: '来',
      origin: '拉丁语 venire',
      color: '#FF7F50',
    },
    {
      text: '-ion',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  creature: [
    {
      text: 'creat',
      type: 'root',
      meaning: '创造',
      origin: '拉丁语 creare',
      color: '#20B2AA',
    },
    {
      text: '-ure',
      type: 'suffix',
      meaning: '行为/结果(名词)',
      origin: '拉丁语',
      color: '#7F8C8D',
    },
  ],
  creation: [
    {
      text: 'creat',
      type: 'root',
      meaning: '创造',
      origin: '拉丁语 creare',
      color: '#20B2AA',
    },
    {
      text: '-ation',
      type: 'suffix',
      meaning: '行为/状态(名词)',
      origin: '拉丁语',
      color: '#00D4AA',
    },
  ],
  creative: [
    {
      text: 'creat',
      type: 'root',
      meaning: '创造',
      origin: '拉丁语 creare',
      color: '#20B2AA',
    },
    {
      text: '-ive',
      type: 'suffix',
      meaning: '有...性质的',
      origin: '拉丁语',
      color: '#F39C12',
    },
  ],
};

// Generate a Chinese translation for an enrichment example sentence
const translateExample = (
  example: string,
  word: string,
  meaning: string,
  pos: string,
): string => {
  // Clean the meaning: take first short meaning, strip trailing 的/地
  let m = meaning.split('/')[0].split('；')[0].split(',')[0].trim();
  const mClean = m.replace(/的$/, '').replace(/地$/, '');

  const posKey = pos.replace('.', '');
  const isAdj = posKey === 'a' || posKey === 'adj';
  const isAdv = posKey === 'ad' || posKey === 'adv';
  const isNoun = posKey === 'n';
  const isVerb = posKey === 'v';

  if (isAdj) {
    const opts = [
      `句中 ${word} 意为"${mClean}的"，用来修饰描述事物的性质。`,
      `${word} 在此表示"${mClean}的"，形容相关事物的特征。`,
      `此处 ${word} 是形容词，意思是"${mClean}的"。`,
    ];
    return opts[(word.charCodeAt(0) + example.length) % opts.length];
  }
  if (isAdv) {
    const opts = [
      `句中 ${word} 意为"${mClean}地"，修饰动作的方式。`,
      `${word} 在此表示"${mClean}地"，描述行为的状态。`,
      `此处 ${word} 是副词，意思是"${mClean}地"。`,
    ];
    return opts[(word.charCodeAt(0) + example.length) % opts.length];
  }
  if (isNoun) {
    const opts = [
      `句中 ${word} 意为"${m}"，指代相关的事物或概念。`,
      `${word} 在此表示"${m}"，是句子的关键名词。`,
      `此处 ${word} 是名词，意思是"${m}"。`,
    ];
    return opts[(word.charCodeAt(0) + example.length) % opts.length];
  }
  if (isVerb) {
    const opts = [
      `句中 ${word} 意为"${m}"，表示所进行的动作。`,
      `${word} 在此表示"${m}"，描述主语的行为。`,
      `此处 ${word} 是动词，意思是"${m}"。`,
    ];
    return opts[(word.charCodeAt(0) + example.length) % opts.length];
  }

  // Fallback for other POS (prep, conj, etc.)
  return `句中 ${word} 的意思是"${m}"。`;
};

// Get real example sentence from enrichment data, with fallback
const generateExample = (
  word: string,
  meaning: string,
  pos: string,
): {example: string; translation: string} => {
  const data = enrichment[word.toLowerCase()];
  if (data?.examples && data.examples.length > 0) {
    const sorted = [...data.examples].sort((a, b) => a.length - b.length);
    const picked =
      sorted.find(e => e.length >= 20 && e.length <= 120) || sorted[0];
    const pickedIndex = data.examples.indexOf(picked);
    let example = picked;
    if (example.length > 150) {
      const cutoff = example.lastIndexOf('.', 150);
      if (cutoff > 40) {
        example = example.slice(0, cutoff + 1);
      } else {
        example = example.slice(0, 147) + '...';
      }
    }
    const formatted = example.charAt(0).toUpperCase() + example.slice(1);
    const withPeriod =
      formatted.endsWith('.') ||
      formatted.endsWith('!') ||
      formatted.endsWith('?')
        ? formatted
        : formatted + '.';
    let translation: string;
    if (data.exampleTranslations && data.exampleTranslations[pickedIndex]) {
      translation = data.exampleTranslations[pickedIndex];
    } else {
      const serviceTranslation = translationService.translateText(withPeriod);
      translation =
        serviceTranslation !== withPeriod
          ? serviceTranslation
          : translateExample(withPeriod, word, meaning, pos);
    }
    return {example: withPeriod, translation};
  }

  // Fallback: more varied and natural templates
  const templates: Record<
    string,
    Array<{en: (w: string) => string; cn: (m: string) => string}>
  > = {
    v: [
      {
        en: w => `The company plans to ${w} new products next year.`,
        cn: m => `公司计划明年${m}新产品。`,
      },
      {
        en: w => `Can you ${w} this document for me?`,
        cn: m => `你能帮我${m}这份文件吗？`,
      },
      {
        en: w => `Scientists are trying to ${w} the phenomenon.`,
        cn: m => `科学家们正在尝试${m}这一现象。`,
      },
      {
        en: w => `The government decided to ${w} the new policy.`,
        cn: m => `政府决定${m}新政策。`,
      },
      {
        en: w => `He managed to ${w} the problem quickly.`,
        cn: m => `他设法迅速${m}了这个问题。`,
      },
      {
        en: w => `They will ${w} the agreement tomorrow.`,
        cn: m => `他们明天将${m}这项协议。`,
      },
    ],
    n: [
      {
        en: w => `The ${w} of the project exceeded expectations.`,
        cn: m => `该项目的${m}超出了预期。`,
      },
      {
        en: w => `Her ${w} in this field is widely recognized.`,
        cn: m => `她在这一领域的${m}得到了广泛认可。`,
      },
      {
        en: w => `The ${w} between the two systems is significant.`,
        cn: m => `两个系统之间的${m}是显著的。`,
      },
      {
        en: w => `This ${w} has been debated for decades.`,
        cn: m => `这个${m}已经争论了数十年。`,
      },
      {
        en: w => `A clear ${w} is essential for success.`,
        cn: m => `明确的${m}对成功至关重要。`,
      },
      {
        en: w => `The ${w} of modern technology has changed our lives.`,
        cn: m => `现代技术的${m}改变了我们的生活。`,
      },
    ],
    a: [
      {
        en: w => `This is a highly ${w} method.`,
        cn: m => `这是一种非常${m}的方法。`,
      },
      {
        en: w => `The situation became increasingly ${w}.`,
        cn: m => `情况变得越来越${m}。`,
      },
      {
        en: w => `His work is considered ${w} by experts.`,
        cn: m => `他的工作被专家认为是${m}的。`,
      },
      {
        en: w => `It would be ${w} to consider all options.`,
        cn: m => `考虑所有选项是${m}的。`,
      },
      {
        en: w => `The ${w} nature of this discovery surprised everyone.`,
        cn: m => `这一发现${m}的性质让所有人惊讶。`,
      },
    ],
    ad: [
      {
        en: w => `The project progressed ${w} under new leadership.`,
        cn: m => `在新领导下，项目${m}地推进。`,
      },
      {
        en: w => `She ${w} explained the complex theory.`,
        cn: m => `她${m}地解释了这个复杂理论。`,
      },
      {
        en: w => `The economy has ${w} improved this year.`,
        cn: m => `经济今年${m}地改善了。`,
      },
    ],
  };

  const posKey = pos.replace('.', '');
  const options = templates[posKey] || templates.v;
  const idx = (word.charCodeAt(0) + word.length) % options.length;
  return {
    example: options[idx].en(word),
    translation: options[idx].cn(meaning),
  };
};

// === Build all words ===

let wordIdCounter = 0;

const buildRootWords = (): {words: Word[]; roots: WordRoot[]} => {
  const words: Word[] = [];
  const roots: WordRoot[] = [];

  (rawData as any).roots.forEach((rootData: any) => {
    const root: WordRoot = {
      id: rootData.id,
      root: rootData.root,
      meaning: rootData.meaning,
      origin: rootData.origin,
      color: rootData.color,
      level: rootData.level,
      words: rootData.words.map((w: any) => ({
        word: w.word,
        meaning: w.meaning,
      })),
    };
    roots.push(root);

    rootData.words.forEach((w: any, idx: number) => {
      wordIdCounter++;
      const pos = posMap[w.pos] || w.pos;
      const morphemes = buildMorphemes(
        w.word,
        rootData.root,
        rootData.meaning,
        rootData.color,
        rootData.origin,
      );
      const {example, translation} = generateExample(
        w.word,
        w.meaning.split('/')[0],
        w.pos,
      );
      const association = buildAssociation(
        w.word,
        rootData.meaning,
        rootData.root,
      );

      const serviceDef = translationService.getDefinition(w.word);
      const meanings = serviceDef?.definitions || w.meaning.split('/');

      words.push({
        id: wordIdCounter,
        word: w.word,
        phonetic: getPhonetic(w.word) || serviceDef?.phonetic || '',
        partOfSpeech: pos,
        meaning: w.meaning,
        meanings,
        morphemes,
        example: serviceDef?.examples?.[0]?.en || example,
        translation: serviceDef?.examples?.[0]?.zh || translation,
        associationStory: association,
        roots: [rootData.root],
        level: rootData.level,
        frequency: Math.max(100 - rootData.level * 10 - idx, 10),
        rootId: rootData.id,
      });
    });
  });

  return {words, roots};
};

const analyzeSupplementMorphemes = (word: string, meaning: string) => {
  const lowerWord = word.toLowerCase();

  if (extendedMorphemeOverrides[lowerWord]) {
    return extendedMorphemeOverrides[lowerWord];
  }

  for (const [rootId, rootData] of Object.entries(extendedRoots)) {
    if (lowerWord.includes(rootId) && lowerWord.length > rootId.length + 1) {
      return buildMorphemes(
        word,
        rootId,
        rootData.meaning,
        rootData.color,
        rootData.origin,
      );
    }
  }

  for (const p of prefixes) {
    const cleanPrefix = p.prefix.replace(/[-/].*/g, '');
    if (
      lowerWord.startsWith(cleanPrefix) &&
      lowerWord.length > cleanPrefix.length + 2
    ) {
      const afterPrefix = lowerWord.slice(cleanPrefix.length);
      for (const [rootId, rootData] of Object.entries(extendedRoots)) {
        if (afterPrefix.includes(rootId)) {
          return buildMorphemes(
            word,
            rootId,
            rootData.meaning,
            rootData.color,
            rootData.origin,
          );
        }
      }
    }
  }

  for (const s of suffixes) {
    const variants = s.suffix.replace('-', '').split('/');
    for (const v of variants) {
      if (lowerWord.endsWith(v) && lowerWord.length > v.length + 2) {
        const beforeSuffix = lowerWord.slice(0, -v.length);
        for (const [rootId, rootData] of Object.entries(extendedRoots)) {
          if (beforeSuffix.includes(rootId)) {
            return buildMorphemes(
              word,
              rootId,
              rootData.meaning,
              rootData.color,
              rootData.origin,
            );
          }
        }
      }
    }
  }

  return [
    {text: word, type: 'root' as const, meaning, origin: '', color: '#A06F3B'},
  ];
};

const buildSupplementWords = (): Word[] => {
  const words: Word[] = [];
  const supplement = (rawData as any).supplement;
  if (!supplement) {
    return words;
  }

  const categoryLevels: Record<string, number> = {
    日常基础: 1,
    社会生活: 3,
    学术科技: 5,
    进阶词汇: 7,
  };

  Object.entries(supplement).forEach(([category, wordList]: [string, any]) => {
    const level = categoryLevels[category] || 5;
    wordList.forEach((w: any, idx: number) => {
      wordIdCounter++;
      const pos = posMap[w.pos] || w.pos;
      const {example, translation} = generateExample(w.word, w.meaning, w.pos);
      const morphemes = analyzeSupplementMorphemes(w.word, w.meaning);

      const serviceDef = translationService.getDefinition(w.word);
      const meanings = serviceDef?.definitions || w.meaning.split('/');

      words.push({
        id: wordIdCounter,
        word: w.word,
        phonetic: getPhonetic(w.word) || serviceDef?.phonetic || '',
        partOfSpeech: pos,
        meaning: w.meaning,
        meanings,
        morphemes,
        example: serviceDef?.examples?.[0]?.en || example,
        translation: serviceDef?.examples?.[0]?.zh || translation,
        associationStory:
          morphemes.length > 1
            ? `${w.word} = ${morphemes.map(m => m.text).join(' + ')}`
            : `${w.word} - ${w.meaning}`,
        roots: morphemes.filter(m => m.type === 'root').map(m => m.text),
        level,
        frequency: Math.max(80 - level * 5 - (idx % 20), 5),
        category,
      });
    });
  });

  return words;
};

// Initialize database
const {words: rootWords, roots} = buildRootWords();
const supplementWords = buildSupplementWords();

export const allWords: Word[] = [...rootWords, ...supplementWords];
export const coreRoots: WordRoot[] = roots;

// === Lookup helpers ===

export const getWordsByRoot = (rootId: string): Word[] => {
  return allWords.filter(w => w.rootId === rootId);
};

export const searchWords = (query: string): Word[] => {
  const q = query.toLowerCase().trim();
  if (!q) {
    return [];
  }
  return allWords
    .filter(
      w =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.includes(q) ||
        w.roots.some(r => r.includes(q)),
    )
    .slice(0, 50);
};

// === Lookalike / confusable words (形近词) ===

const levenshtein = (a: string, b: string): number => {
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({length: m + 1}, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
};

// Check if two words share a long common substring (visual similarity)
const longestCommonSubstring = (a: string, b: string): number => {
  const m = a.length,
    n = b.length;
  let max = 0;
  const dp: number[][] = Array.from({length: m + 1}, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        if (dp[i][j] > max) {
          max = dp[i][j];
        }
      }
    }
  }
  return max;
};

/**
 * Find visually similar words (形近词).
 * Uses edit distance + common substring to find words that "look alike"
 * but have different meanings – a common source of confusion for learners.
 */
const similarCache = new Map<number, Word[]>();

export const getSimilarWords = (word: Word, maxResults: number = 6): Word[] => {
  const cached = similarCache.get(word.id);
  if (cached) {
    return cached.slice(0, maxResults);
  }
  const w = word.word.toLowerCase();
  const minLen = 4; // skip very short words
  if (w.length < minLen) {
    return [];
  }

  const candidates: {word: Word; score: number}[] = [];

  for (const candidate of allWords) {
    if (candidate.id === word.id) {
      continue;
    }
    const c = candidate.word.toLowerCase();
    if (c.length < minLen) {
      continue;
    }

    // Length difference too big → skip
    const lenDiff = Math.abs(w.length - c.length);
    if (lenDiff > 2) {
      continue;
    }

    const dist = levenshtein(w, c);
    // Allow edit distance 1-2 for similar-length words
    const maxDist = Math.min(2, Math.floor(Math.max(w.length, c.length) * 0.3));
    if (dist < 1 || dist > maxDist) {
      continue;
    }

    // Must share a meaningful common substring
    const lcs = longestCommonSubstring(w, c);
    if (lcs < 3) {
      continue;
    }

    // Score: lower is more similar. Prefer same-length, smaller edit distance, longer LCS
    const score = dist * 10 - lcs * 3 + lenDiff * 2;
    candidates.push({word: candidate, score});
  }

  candidates.sort((a, b) => a.score - b.score);
  const result = candidates.slice(0, maxResults).map(c => c.word);
  similarCache.set(word.id, result);
  return result;
};
