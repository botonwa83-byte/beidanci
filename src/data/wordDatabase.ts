import { Word, WordRoot, Prefix, Suffix, Level } from './types';

export const levels: Level[] = [
  { level: 1, name: '入门', description: '掌握最基础的词根词缀和高频单词', targetWords: 300, rootsCount: 20, prefixesCount: 5, suffixesCount: 5 },
  { level: 2, name: '基础', description: '扩展词根词缀，学习常用单词', targetWords: 500, rootsCount: 30, prefixesCount: 10, suffixesCount: 10 },
  { level: 3, name: '进阶', description: '深入学习词根词缀，掌握中等难度单词', targetWords: 700, rootsCount: 40, prefixesCount: 15, suffixesCount: 15 },
  { level: 4, name: '中级', description: '掌握更多词根词缀，学习较复杂单词', targetWords: 900, rootsCount: 50, prefixesCount: 20, suffixesCount: 20 },
  { level: 5, name: '中高', description: '扩展高级词根词缀，学习多词素组合', targetWords: 1100, rootsCount: 60, prefixesCount: 25, suffixesCount: 25 },
  { level: 6, name: '高级', description: '掌握专业词汇和学术词汇', targetWords: 1300, rootsCount: 70, prefixesCount: 30, suffixesCount: 30 },
  { level: 7, name: '进阶高', description: '深入学术词汇和专业术语', targetWords: 1500, rootsCount: 80, prefixesCount: 35, suffixesCount: 35 },
  { level: 8, name: '专家', description: '掌握GRE级别词汇', targetWords: 1700, rootsCount: 90, prefixesCount: 40, suffixesCount: 40 },
  { level: 9, name: '大师', description: '掌握高阶词汇和难词', targetWords: 1900, rootsCount: 100, prefixesCount: 45, suffixesCount: 45 },
  { level: 10, name: '终极', description: '掌握全部词根词缀和8000+词汇', targetWords: 2200, rootsCount: 200, prefixesCount: 50, suffixesCount: 50 },
];

export const coreRoots: WordRoot[] = [
  { id: 'r001', root: 'port', meaning: '携带，运送', origin: '拉丁语 portare', color: '#3B82A0', level: 1, words: [{ word: 'transport', meaning: '运输' }, { word: 'import', meaning: '进口' }, { word: 'export', meaning: '出口' }] },
  { id: 'r002', root: 'cred', meaning: '相信', origin: '拉丁语 credere', color: '#A03B82', level: 1, words: [{ word: 'credit', meaning: '信用' }, { word: 'incredible', meaning: '难以置信的' }, { word: 'credible', meaning: '可信的' }] },
  { id: 'r003', root: 'scrib', meaning: '写', origin: '拉丁语 scribere', color: '#82A03B', level: 1, words: [{ word: 'describe', meaning: '描述' }, { word: 'subscribe', meaning: '订阅' }, { word: 'prescribe', meaning: '开处方' }] },
  { id: 'r004', root: 'magn', meaning: '大，伟大', origin: '拉丁语 magnus', color: '#A06F3B', level: 1, words: [{ word: 'magnify', meaning: '放大' }, { word: 'magnificent', meaning: '壮丽的' }, { word: 'magnitude', meaning: '量级' }] },
  { id: 'r005', root: 'dict', meaning: '说，言', origin: '拉丁语 dicere', color: '#3B9B82', level: 1, words: [{ word: 'dictionary', meaning: '字典' }, { word: 'predict', meaning: '预测' }, { word: 'contradict', meaning: '反驳' }] },
  { id: 'r006', root: 'spect', meaning: '看', origin: '拉丁语 spectare', color: '#9B3B82', level: 1, words: [{ word: 'inspect', meaning: '检查' }, { word: 'respect', meaning: '尊重' }, { word: 'spectator', meaning: '观众' }] },
  { id: 'r007', root: 'struct', meaning: '建造', origin: '拉丁语 struere', color: '#3B6B9B', level: 2, words: [{ word: 'construct', meaning: '建造' }, { word: 'structure', meaning: '结构' }, { word: 'instruct', meaning: '指导' }] },
  { id: 'r008', root: 'form', meaning: '形状，形式', origin: '拉丁语 forma', color: '#6B9B3B', level: 2, words: [{ word: 'transform', meaning: '转变' }, { word: 'inform', meaning: '通知' }, { word: 'reform', meaning: '改革' }] },
  { id: 'r009', root: 'duct', meaning: '引导', origin: '拉丁语 ducere', color: '#9B6B3B', level: 2, words: [{ word: 'conduct', meaning: '引导' }, { word: 'produce', meaning: '生产' }, { word: 'reduce', meaning: '减少' }] },
  { id: 'r010', root: 'ject', meaning: '投掷', origin: '拉丁语 jacere', color: '#3B829B', level: 2, words: [{ word: 'project', meaning: '项目' }, { word: 'reject', meaning: '拒绝' }, { word: 'inject', meaning: '注射' }] },
  { id: 'r011', root: 'tract', meaning: '拉，拖', origin: '拉丁语 trahere', color: '#823B9B', level: 2, words: [{ word: 'attract', meaning: '吸引' }, { word: 'extract', meaning: '提取' }, { word: 'contract', meaning: '合同' }] },
  { id: 'r012', root: 'mit', meaning: '发送', origin: '拉丁语 mittere', color: '#5BA03B', level: 2, words: [{ word: 'submit', meaning: '提交' }, { word: 'transmit', meaning: '传输' }, { word: 'permit', meaning: '允许' }] },
  { id: 'r013', root: 'pos', meaning: '放置', origin: '拉丁语 ponere', color: '#A03B5B', level: 2, words: [{ word: 'compose', meaning: '组成' }, { word: 'dispose', meaning: '处理' }, { word: 'propose', meaning: '提议' }] },
  { id: 'r014', root: 'vis', meaning: '看', origin: '拉丁语 videre', color: '#3BA082', level: 3, words: [{ word: 'vision', meaning: '视觉' }, { word: 'visible', meaning: '可见的' }, { word: 'supervise', meaning: '监督' }] },
  { id: 'r015', root: 'aud', meaning: '听', origin: '拉丁语 audire', color: '#823BA0', level: 3, words: [{ word: 'audio', meaning: '音频' }, { word: 'audience', meaning: '观众' }, { word: 'audition', meaning: '试听' }] },
  { id: 'r016', root: 'sent', meaning: '感觉', origin: '拉丁语 sentire', color: '#A0823B', level: 3, words: [{ word: 'consent', meaning: '同意' }, { word: 'resent', meaning: '怨恨' }, { word: 'present', meaning: '呈现' }] },
  { id: 'r017', root: 'vert', meaning: '转', origin: '拉丁语 vertere', color: '#3BA05B', level: 3, words: [{ word: 'convert', meaning: '转换' }, { word: 'revert', meaning: '恢复' }, { word: 'divert', meaning: '转移' }] },
  { id: 'r018', root: 'voc', meaning: '呼叫', origin: '拉丁语 vocare', color: '#A03B82', level: 3, words: [{ word: 'vocabulary', meaning: '词汇' }, { word: 'advocate', meaning: '倡导' }, { word: 'provoke', meaning: '挑衅' }] },
  { id: 'r019', root: 'pend', meaning: '悬挂', origin: '拉丁语 pendere', color: '#3B82A0', level: 3, words: [{ word: 'depend', meaning: '依赖' }, { word: 'suspend', meaning: '暂停' }, { word: 'append', meaning: '附加' }] },
  { id: 'r020', root: 'fac', meaning: '做，制作', origin: '拉丁语 facere', color: '#82A03B', level: 3, words: [{ word: 'factory', meaning: '工厂' }, { word: 'facility', meaning: '设施' }, { word: 'manufacture', meaning: '制造' }] },
];

export const prefixes: Prefix[] = [
  { id: 'p001', prefix: 'trans-', meaning: '穿越，跨越', origin: '拉丁语', color: '#A03B82', level: 1, examples: ['transport', 'transfer', 'transform'] },
  { id: 'p002', prefix: 'in-', meaning: '不，向内', origin: '拉丁语', color: '#FF6B6B', level: 1, examples: ['incredible', 'import', 'include'] },
  { id: 'p003', prefix: 're-', meaning: '再次，返回', origin: '拉丁语', color: '#4ECDC4', level: 1, examples: ['return', 'repeat', 'review'] },
  { id: 'p004', prefix: 'ex-', meaning: '向外', origin: '拉丁语', color: '#FFE66D', level: 1, examples: ['export', 'exit', 'expand'] },
  { id: 'p005', prefix: 'pre-', meaning: '在...之前', origin: '拉丁语', color: '#95E1D3', level: 1, examples: ['predict', 'prepare', 'prevent'] },
  { id: 'p006', prefix: 'dis-', meaning: '否定，分离', origin: '拉丁语', color: '#DDA0DD', level: 2, examples: ['disagree', 'discover', 'disappear'] },
  { id: 'p007', prefix: 'un-', meaning: '不，相反', origin: '古英语', color: '#98D8C8', level: 2, examples: ['unhappy', 'unable', 'unlock'] },
  { id: 'p008', prefix: 'sub-', meaning: '在...下面', origin: '拉丁语', color: '#F7DC6F', level: 2, examples: ['subway', 'submit', 'subscribe'] },
  { id: 'p009', prefix: 'super-', meaning: '超级，在...上面', origin: '拉丁语', color: '#BB8FCE', level: 2, examples: ['superman', 'supervise', 'superior'] },
  { id: 'p010', prefix: 'inter-', meaning: '在...之间', origin: '拉丁语', color: '#85C1E9', level: 2, examples: ['international', 'internet', 'interview'] },
];

export const suffixes: Suffix[] = [
  { id: 's001', suffix: '-tion', meaning: '名词后缀，表示行为/状态', origin: '拉丁语', color: '#00D4AA', level: 1, partOfSpeech: 'noun', examples: ['action', 'nation', 'education'] },
  { id: 's002', suffix: '-able', meaning: '能够...的', origin: '拉丁语', color: '#00D4AA', level: 1, partOfSpeech: 'adjective', examples: ['readable', 'comfortable', 'available'] },
  { id: 's003', suffix: '-ment', meaning: '名词后缀，表示行为/结果', origin: '拉丁语', color: '#00D4AA', level: 1, partOfSpeech: 'noun', examples: ['movement', 'development', 'agreement'] },
  { id: 's004', suffix: '-ly', meaning: '副词后缀', origin: '古英语', color: '#00D4AA', level: 1, partOfSpeech: 'adverb', examples: ['quickly', 'slowly', 'carefully'] },
  { id: 's005', suffix: '-ness', meaning: '名词后缀，表示状态/性质', origin: '古英语', color: '#00D4AA', level: 1, partOfSpeech: 'noun', examples: ['happiness', 'darkness', 'kindness'] },
  { id: 's006', suffix: '-ful', meaning: '充满...的', origin: '古英语', color: '#FF6B6B', level: 2, partOfSpeech: 'adjective', examples: ['beautiful', 'helpful', 'wonderful'] },
  { id: 's007', suffix: '-less', meaning: '没有...的', origin: '古英语', color: '#FF6B6B', level: 2, partOfSpeech: 'adjective', examples: ['homeless', 'careless', 'endless'] },
  { id: 's008', suffix: '-er', meaning: '做...的人/物', origin: '古英语', color: '#FF6B6B', level: 2, partOfSpeech: 'noun', examples: ['teacher', 'worker', 'player'] },
  { id: 's009', suffix: '-ist', meaning: '从事...的人', origin: '希腊语', color: '#FF6B6B', level: 2, partOfSpeech: 'noun', examples: ['artist', 'scientist', 'pianist'] },
  { id: 's010', suffix: '-ize', meaning: '使成为', origin: '希腊语', color: '#FF6B6B', level: 2, partOfSpeech: 'verb', examples: ['realize', 'organize', 'recognize'] },
];

export const generateMockWords = (): Word[] => {
  const words: Word[] = [];
  const wordList = [
    { word: 'transport', phonetic: '/trænsˈpɔːrt/', pos: 'v./n.', meaning: '运输，运送', level: 1, freq: 100 },
    { word: 'import', phonetic: '/ˈɪmpɔːrt/', pos: 'v./n.', meaning: '进口，输入', level: 1, freq: 95 },
    { word: 'export', phonetic: '/ˈekspɔːrt/', pos: 'v./n.', meaning: '出口，输出', level: 1, freq: 90 },
    { word: 'portable', phonetic: '/ˈpɔːrtəbl/', pos: 'adj.', meaning: '便携的', level: 1, freq: 85 },
    { word: 'report', phonetic: '/rɪˈpɔːrt/', pos: 'v./n.', meaning: '报告', level: 1, freq: 92 },
    { word: 'credit', phonetic: '/ˈkredɪt/', pos: 'n./v.', meaning: '信用，学分', level: 1, freq: 88 },
    { word: 'incredible', phonetic: '/ɪnˈkredəbl/', pos: 'adj.', meaning: '难以置信的', level: 1, freq: 86 },
    { word: 'credible', phonetic: '/ˈkredəbl/', pos: 'adj.', meaning: '可信的', level: 2, freq: 75 },
    { word: 'describe', phonetic: '/dɪˈskraɪb/', pos: 'v.', meaning: '描述', level: 1, freq: 94 },
    { word: 'subscribe', phonetic: '/səbˈskraɪb/', pos: 'v.', meaning: '订阅', level: 2, freq: 78 },
    { word: 'prescribe', phonetic: '/prɪˈskraɪb/', pos: 'v.', meaning: '开处方', level: 3, freq: 65 },
    { word: 'magnificent', phonetic: '/mæɡˈnɪfɪsnt/', pos: 'adj.', meaning: '壮丽的', level: 2, freq: 82 },
    { word: 'magnify', phonetic: '/ˈmæɡnɪfaɪ/', pos: 'v.', meaning: '放大', level: 2, freq: 70 },
    { word: 'predict', phonetic: '/prɪˈdɪkt/', pos: 'v.', meaning: '预测', level: 2, freq: 80 },
    { word: 'dictionary', phonetic: '/ˈdɪkʃəneri/', pos: 'n.', meaning: '字典', level: 1, freq: 96 },
    { word: 'inspect', phonetic: '/ɪnˈspekt/', pos: 'v.', meaning: '检查', level: 2, freq: 72 },
    { word: 'respect', phonetic: '/rɪˈspekt/', pos: 'n./v.', meaning: '尊重', level: 1, freq: 91 },
    { word: 'construct', phonetic: '/kənˈstrʌkt/', pos: 'v.', meaning: '建造', level: 2, freq: 76 },
    { word: 'structure', phonetic: '/ˈstrʌktʃər/', pos: 'n.', meaning: '结构', level: 2, freq: 84 },
    { word: 'transform', phonetic: '/trænsˈfɔːrm/', pos: 'v.', meaning: '转变', level: 2, freq: 79 },
    { word: 'inform', phonetic: '/ɪnˈfɔːrm/', pos: 'v.', meaning: '通知', level: 1, freq: 93 },
    { word: 'conduct', phonetic: '/kənˈdʌkt/', pos: 'v./n.', meaning: '引导，行为', level: 2, freq: 77 },
    { word: 'produce', phonetic: '/prəˈdjuːs/', pos: 'v.', meaning: '生产', level: 2, freq: 83 },
    { word: 'project', phonetic: '/ˈprɒdʒekt/', pos: 'n.', meaning: '项目', level: 2, freq: 87 },
    { word: 'reject', phonetic: '/rɪˈdʒekt/', pos: 'v.', meaning: '拒绝', level: 2, freq: 74 },
    { word: 'attract', phonetic: '/əˈtrækt/', pos: 'v.', meaning: '吸引', level: 2, freq: 81 },
    { word: 'extract', phonetic: '/ɪkˈstrækt/', pos: 'v.', meaning: '提取', level: 3, freq: 68 },
    { word: 'submit', phonetic: '/səbˈmɪt/', pos: 'v.', meaning: '提交', level: 2, freq: 73 },
    { word: 'transmit', phonetic: '/trænzˈmɪt/', pos: 'v.', meaning: '传输', level: 3, freq: 66 },
    { word: 'compose', phonetic: '/kəmˈpəʊz/', pos: 'v.', meaning: '组成', level: 2, freq: 71 },
    { word: 'propose', phonetic: '/prəˈpəʊz/', pos: 'v.', meaning: '提议', level: 3, freq: 64 },
    { word: 'vision', phonetic: '/ˈvɪʒən/', pos: 'n.', meaning: '视觉', level: 2, freq: 78 },
    { word: 'visible', phonetic: '/ˈvɪzəbl/', pos: 'adj.', meaning: '可见的', level: 2, freq: 85 },
    { word: 'audio', phonetic: '/ˈɔːdiəʊ/', pos: 'n.', meaning: '音频', level: 2, freq: 80 },
    { word: 'audience', phonetic: '/ˈɔːdiəns/', pos: 'n.', meaning: '观众', level: 2, freq: 82 },
    { word: 'convert', phonetic: '/kənˈvɜːt/', pos: 'v.', meaning: '转换', level: 3, freq: 67 },
    { word: 'revert', phonetic: '/rɪˈvɜːt/', pos: 'v.', meaning: '恢复', level: 3, freq: 63 },
    { word: 'depend', phonetic: '/dɪˈpend/', pos: 'v.', meaning: '依赖', level: 2, freq: 86 },
    { word: 'suspend', phonetic: '/səˈspend/', pos: 'v.', meaning: '暂停', level: 3, freq: 62 },
    { word: 'factory', phonetic: '/ˈfæktəri/', pos: 'n.', meaning: '工厂', level: 2, freq: 84 },
    { word: 'manufacture', phonetic: '/ˌmænjuˈfæktʃər/', pos: 'v./n.', meaning: '制造', level: 3, freq: 61 },
  ];

  const rootMap: Record<string, WordRoot> = {};
  coreRoots.forEach(r => rootMap[r.root] = r);

  wordList.forEach((item, index) => {
    const morphemes = extractMorphemes(item.word, item.level);
    const roots = morphemes.filter(m => m.type === 'root').map(m => m.text);
    
    words.push({
      id: index + 1,
      word: item.word,
      phonetic: item.phonetic,
      partOfSpeech: item.pos,
      meaning: item.meaning,
      morphemes,
      example: `This is an example of ${item.word}.`,
      translation: `这是${item.word}的一个例子。`,
      associationStory: generateAssociationStory(item.word, morphemes),
      roots,
      level: item.level,
      frequency: item.freq,
    });
  });

  return words;
};

const extractMorphemes = (word: string, level: number) => {
  const morphemes = [];
  const prefixMap: Record<string, Prefix> = {};
  prefixes.forEach(p => prefixMap[p.prefix] = p);
  const rootMap: Record<string, WordRoot> = {};
  coreRoots.forEach(r => rootMap[r.root] = r);
  const suffixMap: Record<string, Suffix> = {};
  suffixes.forEach(s => suffixMap[s.suffix] = s);

  let remaining = word;
  
  for (const prefix of Object.values(prefixMap).filter(p => p.level <= level)) {
    if (remaining.startsWith(prefix.prefix.replace('-', ''))) {
      morphemes.push({
        text: prefix.prefix,
        type: 'prefix' as const,
        meaning: prefix.meaning,
        origin: prefix.origin,
        color: prefix.color,
      });
      remaining = remaining.replace(prefix.prefix.replace('-', ''), '');
      break;
    }
  }

  for (const suffix of Object.values(suffixMap).filter(s => s.level <= level)) {
    if (remaining.endsWith(suffix.suffix.replace('-', ''))) {
      const rootPart = remaining.replace(suffix.suffix.replace('-', ''), '');
      for (const root of Object.values(rootMap).filter(r => r.level <= level)) {
        if (rootPart.includes(root.root)) {
          morphemes.push({
            text: root.root,
            type: 'root' as const,
            meaning: root.meaning,
            origin: root.origin,
            color: root.color,
          });
          morphemes.push({
            text: suffix.suffix,
            type: 'suffix' as const,
            meaning: suffix.meaning,
            origin: suffix.origin,
            color: suffix.color,
          });
          return morphemes;
        }
      }
    }
  }

  for (const root of Object.values(rootMap).filter(r => r.level <= level)) {
    if (remaining.includes(root.root)) {
      morphemes.push({
        text: root.root,
        type: 'root' as const,
        meaning: root.meaning,
        origin: root.origin,
        color: root.color,
      });
      return morphemes;
    }
  }

  return [{ text: word, type: 'root' as const, meaning: '', origin: '', color: '#A06F3B' }];
};

const generateAssociationStory = (word: string, morphemes: { text: string; meaning: string }[]) => {
  if (morphemes.length < 2) {
    return `这个单词${word}的意思是...`;
  }
  const parts = morphemes.map(m => `${m.text}(${m.meaning})`).join(' + ');
  return `${word} = ${parts} → 通过组合这些语素的含义，可以理解这个词的意思。`;
};

export const mockWords = generateMockWords();
