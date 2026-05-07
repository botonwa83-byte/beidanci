import { Word, WordRoot, RootWord, Question } from './types';
import { theme } from '../theme';
import { coreRoots, mockWords } from './wordDatabase';

export const todayWords: Word[] = mockWords.slice(0, 3);

export { coreRoots };

export const rootWordMap: Record<string, RootWord[]> = {
  port: [
    { word: 'transport', meaning: '运输', phonetic: '/trænsˈpɔːrt/' },
    { word: 'import', meaning: '进口', phonetic: '/ˈɪmpɔːrt/' },
    { word: 'export', meaning: '出口', phonetic: '/ˈekspɔːrt/' },
    { word: 'portable', meaning: '便携的', phonetic: '/ˈpɔːrtəbl/' },
    { word: 'report', meaning: '报告', phonetic: '/rɪˈpɔːrt/' },
    { word: 'support', meaning: '支持', phonetic: '/səˈpɔːrt/' },
    { word: 'deport', meaning: '驱逐', phonetic: '/dɪˈpɔːrt/' },
    { word: 'portage', meaning: '搬运', phonetic: '/ˈpɔːrtɪdʒ/' },
  ],
  cred: [
    { word: 'credit', meaning: '信用', phonetic: '/ˈkredɪt/' },
    { word: 'incredible', meaning: '难以置信的', phonetic: '/ɪnˈkredəbl/' },
    { word: 'credible', meaning: '可信的', phonetic: '/ˈkredəbl/' },
    { word: 'credential', meaning: '证书', phonetic: '/krɪˈdenʃl/' },
    { word: 'credulous', meaning: '轻信的', phonetic: '/ˈkredjʊləs/' },
    { word: 'incredulity', meaning: '怀疑', phonetic: '/ˌɪnkrəˈdjuːləti/' },
    { word: 'accredit', meaning: '授权', phonetic: '/əˈkredɪt/' },
    { word: 'discredit', meaning: '使丧失信誉', phonetic: '/dɪsˈkredɪt/' },
  ],
  scrib: [
    { word: 'describe', meaning: '描述', phonetic: '/dɪˈskraɪb/' },
    { word: 'subscribe', meaning: '订阅', phonetic: '/səbˈskraɪb/' },
    { word: 'prescribe', meaning: '开处方', phonetic: '/prɪˈskraɪb/' },
    { word: 'inscribe', meaning: '题写', phonetic: '/ɪnˈskraɪb/' },
    { word: 'transcript', meaning: '抄本', phonetic: '/ˈtrænskrɪpt/' },
    { word: 'manuscript', meaning: '手稿', phonetic: '/ˈmænjuskrɪpt/' },
    { word: 'scripture', meaning: '经文', phonetic: '/ˈskrɪptʃər/' },
    { word: 'script', meaning: '剧本', phonetic: '/skrɪpt/' },
  ],
  magn: [
    { word: 'magnify', meaning: '放大', phonetic: '/ˈmæɡnɪfaɪ/' },
    { word: 'magnificent', meaning: '壮丽的', phonetic: '/mæɡˈnɪfɪsnt/' },
    { word: 'magnitude', meaning: '量级', phonetic: '/ˈmæɡnɪtjuːd/' },
    { word: 'magnet', meaning: '磁铁', phonetic: '/ˈmæɡnət/' },
    { word: 'magnate', meaning: '巨头', phonetic: '/ˈmæɡneɪt/' },
    { word: 'magnanimous', meaning: '宽宏大量的', phonetic: '/mæɡˈnænɪməs/' },
    { word: 'magical', meaning: '神奇的', phonetic: '/ˈmædʒɪkl/' },
    { word: 'magician', meaning: '魔术师', phonetic: '/məˈdʒɪʃn/' },
  ],
  dict: [
    { word: 'dictionary', meaning: '字典', phonetic: '/ˈdɪkʃəneri/' },
    { word: 'predict', meaning: '预测', phonetic: '/prɪˈdɪkt/' },
    { word: 'contradict', meaning: '反驳', phonetic: '/ˌkɒntrəˈdɪkt/' },
    { word: 'verdict', meaning: '裁决', phonetic: '/ˈvɜːdɪkt/' },
    { word: 'dictate', meaning: '口述', phonetic: '/ˈdɪkteɪt/' },
    { word: 'addict', meaning: '上瘾', phonetic: '/ˈædɪkt/' },
    { word: 'contradiction', meaning: '矛盾', phonetic: '/ˌkɒntrəˈdɪkʃn/' },
    { word: 'dictum', meaning: '格言', phonetic: '/ˈdɪktəm/' },
  ],
  spect: [
    { word: 'inspect', meaning: '检查', phonetic: '/ɪnˈspekt/' },
    { word: 'respect', meaning: '尊重', phonetic: '/rɪˈspekt/' },
    { word: 'spectator', meaning: '观众', phonetic: '/spekˈteɪtər/' },
    { word: 'spectacle', meaning: '景象', phonetic: '/ˈspektəkl/' },
    { word: 'prospect', meaning: '前景', phonetic: '/ˈprɒspekt/' },
    { word: 'aspect', meaning: '方面', phonetic: '/ˈæspekt/' },
    { word: 'suspect', meaning: '怀疑', phonetic: '/səˈspekt/' },
    { word: 'expect', meaning: '期待', phonetic: '/ɪkˈspekt/' },
  ],
  struct: [
    { word: 'construct', meaning: '建造', phonetic: '/kənˈstrʌkt/' },
    { word: 'structure', meaning: '结构', phonetic: '/ˈstrʌktʃər/' },
    { word: 'instruct', meaning: '指导', phonetic: '/ɪnˈstrʌkt/' },
    { word: 'destruct', meaning: '破坏', phonetic: '/dɪˈstrʌkt/' },
    { word: 'obstruct', meaning: '阻碍', phonetic: '/əbˈstrʌkt/' },
    { word: 'restructure', meaning: '重组', phonetic: '/riːˈstrʌktʃər/' },
    { word: 'infrastructure', meaning: '基础设施', phonetic: '/ˈɪnfrəstrʌktʃər/' },
    { word: 'superstructure', meaning: '上层建筑', phonetic: '/ˈsuːpəstrʌktʃər/' },
  ],
  form: [
    { word: 'transform', meaning: '转变', phonetic: '/trænsˈfɔːrm/' },
    { word: 'inform', meaning: '通知', phonetic: '/ɪnˈfɔːrm/' },
    { word: 'reform', meaning: '改革', phonetic: '/rɪˈfɔːrm/' },
    { word: 'perform', meaning: '执行', phonetic: '/pəˈfɔːrm/' },
    { word: 'conform', meaning: '遵守', phonetic: '/kənˈfɔːrm/' },
    { word: 'deform', meaning: '变形', phonetic: '/dɪˈfɔːrm/' },
    { word: 'uniform', meaning: '统一的', phonetic: '/ˈjuːnɪfɔːm/' },
    { word: 'reform', meaning: '改革', phonetic: '/rɪˈfɔːrm/' },
  ],
};

export const questions: Question[] = [
  {
    id: 1,
    question: '"port"这个词根的含义是什么？',
    options: [
      { text: '相信', isCorrect: false },
      { text: '携带，运送', isCorrect: true },
      { text: '写', isCorrect: false },
      { text: '大，伟大', isCorrect: false },
    ],
    explanation: '"port"来自拉丁语portare，意思是"携带，运送"。例如transport(运输)就是"穿过(trans-)携带(port)"。',
    level: 1,
  },
  {
    id: 2,
    question: '"import"这个单词的正确含义是什么？',
    options: [
      { text: '出口', isCorrect: false },
      { text: '运输', isCorrect: false },
      { text: '进口', isCorrect: true },
      { text: '报告', isCorrect: false },
    ],
    explanation: '"import"由"im-(向内)"和"port(携带)"组成，意思是"向内携带"，即进口。',
    level: 1,
  },
  {
    id: 3,
    question: '"cred"这个词根的含义是什么？',
    options: [
      { text: '相信', isCorrect: true },
      { text: '携带', isCorrect: false },
      { text: '写', isCorrect: false },
      { text: '大', isCorrect: false },
    ],
    explanation: '"cred"来自拉丁语credere，意思是"相信"。例如credit(信用)就是基于信任的。',
    level: 1,
  },
  {
    id: 4,
    question: '"incredible"是什么意思？',
    options: [
      { text: '可相信的', isCorrect: false },
      { text: '难以置信的', isCorrect: true },
      { text: '有信用的', isCorrect: false },
      { text: '怀疑的', isCorrect: false },
    ],
    explanation: '"incredible"由"in-(不)"和"credible(可信的)"组成，意思是"不可信的"，即难以置信的。',
    level: 1,
  },
  {
    id: 5,
    question: '"scrib"这个词根的含义是什么？',
    options: [
      { text: '看', isCorrect: false },
      { text: '听', isCorrect: false },
      { text: '写', isCorrect: true },
      { text: '说', isCorrect: false },
    ],
    explanation: '"scrib"来自拉丁语scribere，意思是"写"。例如describe(描述)就是"向下(de-)写(scrib)"。',
    level: 1,
  },
  {
    id: 6,
    question: '"magnificent"是什么意思？',
    options: [
      { text: '微小的', isCorrect: false },
      { text: '壮丽的', isCorrect: true },
      { text: '普通的', isCorrect: false },
      { text: '无聊的', isCorrect: false },
    ],
    explanation: '"magnificent"由"magn-(大)"和后缀组成，意思是"伟大的，壮丽的"。',
    level: 1,
  },
];
