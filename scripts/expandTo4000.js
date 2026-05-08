#!/usr/bin/env node
/**
 * Expand beidanci word database from ~1893 to 4000 words.
 * Adds new roots with word families and more supplement words.
 */
const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, '..', 'src', 'data', 'wordDatabaseRaw.json');
const data = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

// Track existing words to avoid duplicates
const existingWords = new Set();
data.roots.forEach(r => r.words.forEach(w => existingWords.add(w.word.toLowerCase())));
Object.values(data.supplement).forEach(list => list.forEach(w => existingWords.add(w.word.toLowerCase())));

const addWord = (word, pos, meaning) => {
  if (existingWords.has(word.toLowerCase())) return null;
  existingWords.add(word.toLowerCase());
  return { word, pos, meaning };
};

// ============== NEW ROOTS ==============
const newRoots = [
  {
    id: 'lect', root: 'lect', meaning: '选择/读', origin: '拉丁语 legere', color: '#4A90D9', level: 2,
    words: [
      ['select', 'v', '选择'], ['selection', 'n', '选择'], ['selective', 'a', '有选择性的'],
      ['elect', 'v', '选举'], ['election', 'n', '选举'], ['electronic', 'a', '电子的'],
      ['collect', 'v', '收集'], ['collection', 'n', '收藏'], ['collective', 'a', '集体的'],
      ['collector', 'n', '收藏家'], ['neglect', 'v', '忽视'], ['intellect', 'n', '智力'],
      ['intellectual', 'a', '知识分子的'], ['lecture', 'n', '讲座'], ['dialect', 'n', '方言'],
      ['elegant', 'a', '优雅的'], ['eligible', 'a', '有资格的'],
    ]
  },
  {
    id: 'terr', root: 'terr', meaning: '地/土', origin: '拉丁语 terra', color: '#8B6914', level: 3,
    words: [
      ['territory', 'n', '领土'], ['territorial', 'a', '领土的'], ['terrain', 'n', '地形'],
      ['terrestrial', 'a', '陆地的'], ['terrace', 'n', '露台'], ['mediterranean', 'a', '地中海的'],
      ['subterranean', 'a', '地下的'], ['extraterrestrial', 'a', '外星的'],
      ['terra', 'n', '土地'], ['terrarium', 'n', '陆地动物饲养箱'],
    ]
  },
  {
    id: 'liber', root: 'liber', meaning: '自由', origin: '拉丁语 liber', color: '#2ECC71', level: 3,
    words: [
      ['liberty', 'n', '自由'], ['liberal', 'a', '自由主义的'], ['liberate', 'v', '解放'],
      ['liberation', 'n', '解放'], ['liberator', 'n', '解放者'], ['deliberate', 'a', '故意的'],
      ['deliberately', 'ad', '故意地'], ['deliver', 'v', '递送'], ['delivery', 'n', '递送'],
    ]
  },
  {
    id: 'labor', root: 'labor', meaning: '劳动', origin: '拉丁语 labor', color: '#D4A017', level: 3,
    words: [
      ['labor', 'n', '劳动'], ['laboratory', 'n', '实验室'], ['elaborate', 'a', '精心的'],
      ['collaborate', 'v', '合作'], ['collaboration', 'n', '合作'],
      ['collaborator', 'n', '合作者'], ['laborer', 'n', '劳工'],
    ]
  },
  {
    id: 'jud', root: 'jud', meaning: '判断', origin: '拉丁语 judicare', color: '#8E44AD', level: 3,
    words: [
      ['judge', 'n', '法官/判断'], ['judgment', 'n', '判断'], ['judicial', 'a', '司法的'],
      ['prejudice', 'n', '偏见'], ['prejudicial', 'a', '有害的'], ['adjudicate', 'v', '裁决'],
      ['judicious', 'a', '明智的'],
    ]
  },
  {
    id: 'norm', root: 'norm', meaning: '标准/规范', origin: '拉丁语 norma', color: '#3498DB', level: 3,
    words: [
      ['normal', 'a', '正常的'], ['abnormal', 'a', '异常的'], ['enormous', 'a', '巨大的'],
      ['normalize', 'v', '使正常化'], ['norm', 'n', '规范'], ['normative', 'a', '规范的'],
    ]
  },
  {
    id: 'popul', root: 'popul', meaning: '人民', origin: '拉丁语 populus', color: '#E74C3C', level: 3,
    words: [
      ['popular', 'a', '流行的'], ['popularity', 'n', '流行'], ['population', 'n', '人口'],
      ['populate', 'v', '居住于'], ['unpopular', 'a', '不受欢迎的'], ['populace', 'n', '平民'],
      ['popularize', 'v', '普及'],
    ]
  },
  {
    id: 'simil', root: 'simil', meaning: '相似', origin: '拉丁语 similis', color: '#1ABC9C', level: 4,
    words: [
      ['similar', 'a', '相似的'], ['similarity', 'n', '相似性'], ['similarly', 'ad', '同样地'],
      ['simulate', 'v', '模拟'], ['simulation', 'n', '模拟'], ['simultaneous', 'a', '同时的'],
      ['assimilate', 'v', '同化/吸收'], ['assimilation', 'n', '同化'], ['resemble', 'v', '相似'],
      ['resemblance', 'n', '相似'],
    ]
  },
  {
    id: 'grat', root: 'grat', meaning: '感恩/喜悦', origin: '拉丁语 gratus', color: '#F39C12', level: 4,
    words: [
      ['grateful', 'a', '感激的'], ['gratitude', 'n', '感激'], ['congratulate', 'v', '祝贺'],
      ['congratulation', 'n', '祝贺'], ['grace', 'n', '优雅'], ['graceful', 'a', '优雅的'],
      ['gracious', 'a', '仁慈的'], ['ingratitude', 'n', '忘恩负义'], ['gratify', 'v', '使满足'],
    ]
  },
  {
    id: 'liter', root: 'liter', meaning: '文字', origin: '拉丁语 littera', color: '#2C3E50', level: 4,
    words: [
      ['literal', 'a', '字面的'], ['literally', 'ad', '字面地'], ['literary', 'a', '文学的'],
      ['literature', 'n', '文学'], ['literate', 'a', '有读写能力的'], ['illiterate', 'a', '文盲的'],
      ['literacy', 'n', '读写能力'], ['illiteracy', 'n', '文盲'],
    ]
  },
  {
    id: 'clar', root: 'clar', meaning: '清楚/明亮', origin: '拉丁语 clarus', color: '#F1C40F', level: 4,
    words: [
      ['clear', 'a', '清楚的'], ['clarify', 'v', '澄清'], ['clarification', 'n', '澄清'],
      ['clarity', 'n', '清晰'], ['declare', 'v', '宣布'], ['declaration', 'n', '宣言'],
    ]
  },
  {
    id: 'dur', root: 'dur', meaning: '持久/硬', origin: '拉丁语 durus', color: '#7F8C8D', level: 4,
    words: [
      ['durable', 'a', '耐用的'], ['duration', 'n', '持续时间'], ['endure', 'v', '忍受'],
      ['endurance', 'n', '耐力'], ['during', 'prep', '在...期间'],
    ]
  },
  {
    id: 'firm', root: 'firm', meaning: '坚固/坚定', origin: '拉丁语 firmus', color: '#34495E', level: 4,
    words: [
      ['firm', 'a', '坚固的'], ['confirm', 'v', '确认'], ['confirmation', 'n', '确认'],
      ['affirm', 'v', '肯定'], ['affirmative', 'a', '肯定的'], ['infirm', 'a', '虚弱的'],
    ]
  },
  {
    id: 'fort', root: 'fort', meaning: '强壮/力量', origin: '拉丁语 fortis', color: '#C0392B', level: 4,
    words: [
      ['fortune', 'n', '财富/运气'], ['fortunate', 'a', '幸运的'], ['unfortunate', 'a', '不幸的'],
      ['unfortunately', 'ad', '不幸地'], ['comfort', 'n', '舒适'], ['comfortable', 'a', '舒适的'],
      ['uncomfortable', 'a', '不舒服的'], ['effort', 'n', '努力'], ['enforce', 'v', '执行'],
      ['enforcement', 'n', '执行'], ['reinforce', 'v', '加强'], ['reinforcement', 'n', '加强'],
      ['fortress', 'n', '堡垒'], ['fortify', 'v', '加固'],
    ]
  },
  {
    id: 'gress', root: 'gress', meaning: '走/步', origin: '拉丁语 gradi', color: '#16A085', level: 4,
    words: [
      ['progress', 'n', '进步'], ['progressive', 'a', '进步的'], ['congress', 'n', '国会'],
      ['aggressive', 'a', '侵略性的'], ['aggression', 'n', '侵略'],
      ['digress', 'v', '离题'], ['regress', 'v', '退步'], ['regression', 'n', '回归'],
      ['transgress', 'v', '违反'],
    ]
  },
  {
    id: 'oper', root: 'oper', meaning: '工作', origin: '拉丁语 operari', color: '#2980B9', level: 4,
    words: [
      ['operate', 'v', '操作'], ['operation', 'n', '操作/手术'], ['operator', 'n', '操作员'],
      ['cooperate', 'v', '合作'], ['cooperation', 'n', '合作'], ['cooperative', 'a', '合作的'],
    ]
  },
  {
    id: 'ord', root: 'ord', meaning: '顺序/命令', origin: '拉丁语 ordo', color: '#D35400', level: 5,
    words: [
      ['order', 'n', '命令/顺序'], ['ordinary', 'a', '普通的'], ['extraordinary', 'a', '非凡的'],
      ['disorder', 'n', '混乱'], ['coordinate', 'v', '协调'], ['coordination', 'n', '协调'],
      ['subordinate', 'a', '下级的'], ['ordinal', 'a', '序数的'],
    ]
  },
  {
    id: 'serv', root: 'serv', meaning: '服务/保持', origin: '拉丁语 servare', color: '#27AE60', level: 5,
    words: [
      ['serve', 'v', '服务'], ['service', 'n', '服务'], ['servant', 'n', '仆人'],
      ['preserve', 'v', '保存'], ['preservation', 'n', '保存'], ['conserve', 'v', '保护'],
      ['conservation', 'n', '保护'], ['conservative', 'a', '保守的'],
      ['observe', 'v', '观察'], ['observation', 'n', '观察'], ['observer', 'n', '观察者'],
      ['reserve', 'v', '预订/保留'], ['reservation', 'n', '预订'], ['reservoir', 'n', '水库'],
      ['deserve', 'v', '值得'],
    ]
  },
  {
    id: 'test', root: 'test', meaning: '证明/测试', origin: '拉丁语 testis', color: '#9B59B6', level: 5,
    words: [
      ['test', 'n', '测试'], ['testify', 'v', '作证'], ['testimony', 'n', '证词'],
      ['protest', 'v', '抗议'], ['contest', 'n', '比赛/竞赛'], ['contestant', 'n', '参赛者'],
      ['detest', 'v', '厌恶'], ['attest', 'v', '证明'],
    ]
  },
  {
    id: 'cert', root: 'cert', meaning: '确定/区分', origin: '拉丁语 certus', color: '#1A5276', level: 5,
    words: [
      ['certain', 'a', '确定的'], ['certainly', 'ad', '当然'], ['certainty', 'n', '确定性'],
      ['uncertain', 'a', '不确定的'], ['uncertainty', 'n', '不确定性'],
      ['certificate', 'n', '证书'], ['certify', 'v', '证明'], ['certification', 'n', '认证'],
      ['concert', 'n', '音乐会'], ['discern', 'v', '辨别'],
    ]
  },
  {
    id: 'lumin', root: 'lumin', meaning: '光', origin: '拉丁语 lumen', color: '#F4D03F', level: 5,
    words: [
      ['illuminate', 'v', '照亮'], ['illumination', 'n', '照明'],
      ['luminous', 'a', '发光的'], ['luminary', 'n', '杰出人物'],
    ]
  },
  {
    id: 'sect', root: 'sect', meaning: '切割', origin: '拉丁语 secare', color: '#AF601A', level: 5,
    words: [
      ['section', 'n', '部分'], ['sector', 'n', '部门'], ['insect', 'n', '昆虫'],
      ['intersect', 'v', '相交'], ['intersection', 'n', '交叉路口'],
      ['dissect', 'v', '解剖'], ['bisect', 'v', '平分'],
    ]
  },
  {
    id: 'sist', root: 'sist', meaning: '站立/存在', origin: '拉丁语 sistere', color: '#5D6D7E', level: 5,
    words: [
      ['resist', 'v', '抵抗'], ['resistance', 'n', '抵抗'], ['resistant', 'a', '抵抗的'],
      ['consist', 'v', '组成'], ['consistent', 'a', '一致的'], ['consistency', 'n', '一致性'],
      ['assist', 'v', '帮助'], ['assistance', 'n', '帮助'], ['assistant', 'n', '助手'],
      ['persist', 'v', '坚持'], ['persistent', 'a', '持续的'], ['insist', 'v', '坚持'],
      ['insistence', 'n', '坚持'], ['exist', 'v', '存在'], ['existence', 'n', '存在'],
      ['subsist', 'v', '生存'],
    ]
  },
  {
    id: 'mand', root: 'mand', meaning: '命令/委托', origin: '拉丁语 mandare', color: '#6C3483', level: 5,
    words: [
      ['command', 'v', '命令'], ['commander', 'n', '指挥官'], ['demand', 'v', '要求'],
      ['demanding', 'a', '要求高的'], ['mandate', 'n', '授权'], ['mandatory', 'a', '强制的'],
      ['recommend', 'v', '推荐'], ['recommendation', 'n', '推荐'],
    ]
  },
  {
    id: 'cept', root: 'cept', meaning: '拿/接受', origin: '拉丁语 capere', color: '#117A65', level: 5,
    words: [
      ['accept', 'v', '接受'], ['acceptable', 'a', '可接受的'], ['acceptance', 'n', '接受'],
      ['concept', 'n', '概念'], ['conception', 'n', '概念/构想'],
      ['except', 'prep', '除...之外'], ['exception', 'n', '例外'], ['exceptional', 'a', '杰出的'],
      ['perceive', 'v', '感知'], ['perception', 'n', '感知'], ['deception', 'n', '欺骗'],
      ['intercept', 'v', '拦截'], ['receipt', 'n', '收据'], ['reception', 'n', '接待'],
      ['receptive', 'a', '善于接受的'], ['susceptible', 'a', '易受影响的'],
    ]
  },
  {
    id: 'volv', root: 'volv', meaning: '转/卷', origin: '拉丁语 volvere', color: '#A04000', level: 6,
    words: [
      ['involve', 'v', '涉及'], ['involvement', 'n', '参与'], ['evolve', 'v', '进化'],
      ['evolution', 'n', '进化'], ['revolutionary', 'a', '革命性的'],
      ['revolve', 'v', '旋转'], ['revolution', 'n', '革命'], ['resolve', 'v', '解决'],
      ['resolution', 'n', '决心/分辨率'], ['dissolve', 'v', '溶解'],
    ]
  },
  {
    id: 'prim', root: 'prim', meaning: '第一/首要', origin: '拉丁语 primus', color: '#B7950B', level: 6,
    words: [
      ['primary', 'a', '主要的'], ['primarily', 'ad', '主要地'], ['prime', 'a', '首要的'],
      ['primitive', 'a', '原始的'], ['prince', 'n', '王子'], ['princess', 'n', '公主'],
      ['principal', 'a', '主要的'], ['principle', 'n', '原则'],
    ]
  },
  {
    id: 'clud', root: 'clud', meaning: '关闭', origin: '拉丁语 claudere', color: '#6E2C00', level: 6,
    words: [
      ['include', 'v', '包含'], ['inclusion', 'n', '包含'], ['inclusive', 'a', '包容的'],
      ['exclude', 'v', '排除'], ['exclusion', 'n', '排除'], ['exclusive', 'a', '独家的'],
      ['conclude', 'v', '结论'], ['conclusion', 'n', '结论'],
      ['preclude', 'v', '阻止'], ['seclude', 'v', '隔离'], ['seclusion', 'n', '隔离'],
    ]
  },
  {
    id: 'spec', root: 'spec', meaning: '特殊/种类', origin: '拉丁语 species', color: '#1B4F72', level: 6,
    words: [
      ['special', 'a', '特别的'], ['specialist', 'n', '专家'], ['specialize', 'v', '专攻'],
      ['specialty', 'n', '专业'], ['specific', 'a', '具体的'], ['specifically', 'ad', '具体地'],
      ['specification', 'n', '规格'], ['specimen', 'n', '样本'], ['species', 'n', '物种'],
    ]
  },
  {
    id: 'plex', root: 'plex', meaning: '编织/折叠', origin: '拉丁语 plectere', color: '#4A235A', level: 6,
    words: [
      ['complex', 'a', '复杂的'], ['complexity', 'n', '复杂性'], ['perplex', 'v', '使困惑'],
      ['perplexing', 'a', '令人困惑的'], ['duplex', 'n', '复式公寓'],
      ['multiplex', 'n', '多厅影院'],
    ]
  },
];

// Filter out words that already exist and add to data
let addedRootWords = 0;
for (const root of newRoots) {
  const validWords = [];
  for (const [word, pos, meaning] of root.words) {
    const w = addWord(word, pos, meaning);
    if (w) validWords.push(w);
  }
  if (validWords.length > 0) {
    data.roots.push({
      id: root.id,
      root: root.root,
      meaning: root.meaning,
      origin: root.origin,
      color: root.color,
      level: root.level,
      words: validWords,
    });
    addedRootWords += validWords.length;
  }
}

console.log(`Added ${addedRootWords} new root-based words from ${newRoots.length} new roots`);

// ============== EXPANDED SUPPLEMENT WORDS ==============

const newSupplementWords = {
  '日常基础': [
    // 日常生活
    ['alarm', 'n', '闹钟/警报'], ['apartment', 'n', '公寓'], ['bakery', 'n', '面包店'],
    ['blanket', 'n', '毯子'], ['bucket', 'n', '桶'], ['cabinet', 'n', '橱柜'],
    ['calendar', 'n', '日历'], ['carpet', 'n', '地毯'], ['ceiling', 'n', '天花板'],
    ['chimney', 'n', '烟囱'], ['closet', 'n', '壁橱'], ['curtain', 'n', '窗帘'],
    ['cushion', 'n', '靠垫'], ['doorbell', 'n', '门铃'], ['drawer', 'n', '抽屉'],
    ['envelope', 'n', '信封'], ['faucet', 'n', '水龙头'], ['fence', 'n', '栅栏'],
    ['flashlight', 'n', '手电筒'], ['garage', 'n', '车库'],
    ['grocery', 'n', '杂货店'], ['hallway', 'n', '走廊'], ['handbag', 'n', '手提包'],
    ['helmet', 'n', '头盔'], ['household', 'n', '家庭'], ['kettle', 'n', '水壶'],
    ['laundry', 'n', '洗衣'], ['lawn', 'n', '草坪'], ['mailbox', 'n', '信箱'],
    ['mattress', 'n', '床垫'], ['microwave', 'n', '微波炉'], ['napkin', 'n', '餐巾'],
    ['needle', 'n', '针'], ['oven', 'n', '烤箱'], ['pajamas', 'n', '睡衣'],
    ['pillow', 'n', '枕头'], ['plumber', 'n', '水管工'], ['porch', 'n', '门廊'],
    ['refrigerator', 'n', '冰箱'], ['scissors', 'n', '剪刀'], ['shelf', 'n', '架子'],
    ['socket', 'n', '插座'], ['staircase', 'n', '楼梯'], ['suitcase', 'n', '手提箱'],
    ['tablecloth', 'n', '桌布'], ['thermometer', 'n', '温度计'], ['tissue', 'n', '纸巾'],
    ['toaster', 'n', '烤面包机'], ['toolbox', 'n', '工具箱'], ['towel', 'n', '毛巾'],
    ['umbrella', 'n', '雨伞'], ['vacuum', 'n', '真空/吸尘器'], ['wardrobe', 'n', '衣柜'],
    // 食物饮品
    ['appetizer', 'n', '开胃菜'], ['avocado', 'n', '牛油果'], ['barbecue', 'n', '烧烤'],
    ['beverage', 'n', '饮料'], ['broccoli', 'n', '西兰花'], ['cinnamon', 'n', '肉桂'],
    ['cuisine', 'n', '美食/烹饪'], ['dessert', 'n', '甜点'], ['dough', 'n', '面团'],
    ['ginger', 'n', '生姜'], ['ingredient', 'n', '成分'], ['nutrition', 'n', '营养'],
    ['organic', 'a', '有机的'], ['portion', 'n', '一份'], ['recipe', 'n', '食谱'],
    ['seasoning', 'n', '调味料'], ['snack', 'n', '零食'], ['vinegar', 'n', '醋'],
    // 身体健康
    ['ankle', 'n', '脚踝'], ['appetite', 'n', '食欲'], ['blister', 'n', '水疱'],
    ['bruise', 'n', '瘀伤'], ['calcium', 'n', '钙'], ['cavity', 'n', '蛀牙/腔'],
    ['cholesterol', 'n', '胆固醇'], ['diagnosis', 'n', '诊断'], ['digestion', 'n', '消化'],
    ['fatigue', 'n', '疲劳'], ['fracture', 'n', '骨折'], ['immune', 'a', '免疫的'],
    ['infection', 'n', '感染'], ['inflammation', 'n', '炎症'], ['insomnia', 'n', '失眠'],
    ['migraine', 'n', '偏头痛'], ['muscle', 'n', '肌肉'], ['pharmacy', 'n', '药房'],
    ['physician', 'n', '内科医生'], ['prescription', 'n', '处方'], ['pulse', 'n', '脉搏'],
    ['symptom', 'n', '症状'], ['therapy', 'n', '治疗'], ['vaccine', 'n', '疫苗'],
    ['vitamin', 'n', '维生素'], ['wound', 'n', '伤口'],
    // 交通出行
    ['accelerate', 'v', '加速'], ['boulevard', 'n', '大道'], ['cargo', 'n', '货物'],
    ['commute', 'v', '通勤'], ['congestion', 'n', '拥堵'], ['cruise', 'n', '巡航'],
    ['destination', 'n', '目的地'], ['detour', 'n', '绕道'], ['diesel', 'n', '柴油'],
    ['fare', 'n', '票价'], ['ferry', 'n', '渡轮'], ['freight', 'n', '货运'],
    ['highway', 'n', '高速公路'], ['intersection', 'n', '十字路口'],
    ['itinerary', 'n', '行程'], ['junction', 'n', '交叉口'], ['luggage', 'n', '行李'],
    ['navigation', 'n', '导航'], ['pedestrian', 'n', '行人'], ['platform', 'n', '站台'],
    ['roundabout', 'n', '环形交叉路口'], ['shuttle', 'n', '穿梭巴士'],
    ['sidewalk', 'n', '人行道'], ['terminal', 'n', '航站楼'], ['toll', 'n', '通行费'],
    ['transit', 'n', '运输'], ['tunnel', 'n', '隧道'], ['windshield', 'n', '挡风玻璃'],
  ],
  '社会生活': [
    // 职场商务
    ['accountant', 'n', '会计'], ['agenda', 'n', '议程'], ['applicant', 'n', '申请人'],
    ['apprentice', 'n', '学徒'], ['audit', 'n', '审计'], ['bankruptcy', 'n', '破产'],
    ['bidding', 'n', '投标'], ['bonus', 'n', '奖金'], ['broker', 'n', '经纪人'],
    ['bureaucracy', 'n', '官僚制度'], ['clientele', 'n', '客户群'], ['colleague', 'n', '同事'],
    ['commission', 'n', '佣金/委员会'], ['comptroller', 'n', '审计官'],
    ['consultant', 'n', '顾问'], ['contractor', 'n', '承包商'], ['corporation', 'n', '公司'],
    ['credential', 'n', '资质'], ['curriculum', 'n', '课程'], ['deadline', 'n', '截止日期'],
    ['deficit', 'n', '赤字'], ['delegate', 'v', '委派'], ['dividend', 'n', '股息'],
    ['entrepreneur', 'n', '企业家'], ['franchise', 'n', '特许经营权'],
    ['freelance', 'a', '自由职业的'], ['headquarters', 'n', '总部'],
    ['incentive', 'n', '激励'], ['inflation', 'n', '通货膨胀'], ['intern', 'n', '实习生'],
    ['inventory', 'n', '库存'], ['invoice', 'n', '发票'], ['landlord', 'n', '房东'],
    ['lease', 'n', '租约'], ['leverage', 'n', '杠杆'], ['liability', 'n', '责任/负债'],
    ['logistics', 'n', '物流'], ['merger', 'n', '合并'], ['monopoly', 'n', '垄断'],
    ['mortgage', 'n', '抵押贷款'], ['negotiate', 'v', '谈判'], ['overtime', 'n', '加班'],
    ['patent', 'n', '专利'], ['payroll', 'n', '工资单'], ['pension', 'n', '养老金'],
    ['procurement', 'n', '采购'], ['quota', 'n', '配额'], ['recession', 'n', '衰退'],
    ['recruitment', 'n', '招聘'], ['refund', 'n', '退款'], ['revenue', 'n', '收入'],
    ['salary', 'n', '工资'], ['shareholder', 'n', '股东'], ['subsidiary', 'n', '子公司'],
    ['surplus', 'n', '盈余'], ['tariff', 'n', '关税'], ['tenure', 'n', '任期'],
    ['trademark', 'n', '商标'], ['turnover', 'n', '营业额'], ['vendor', 'n', '供应商'],
    ['voucher', 'n', '凭证'], ['warehouse', 'n', '仓库'], ['wholesale', 'n', '批发'],
    // 法律政治
    ['acquit', 'v', '宣告无罪'], ['advocate', 'v', '提倡'], ['allegation', 'n', '指控'],
    ['amendment', 'n', '修正案'], ['appeal', 'v', '上诉'], ['arbitration', 'n', '仲裁'],
    ['ballot', 'n', '选票'], ['bipartisan', 'a', '两党的'], ['campaign', 'n', '运动'],
    ['candidate', 'n', '候选人'], ['census', 'n', '人口普查'], ['charter', 'n', '宪章'],
    ['coalition', 'n', '联盟'], ['compliance', 'n', '合规'], ['constitution', 'n', '宪法'],
    ['controversy', 'n', '争议'], ['conviction', 'n', '定罪/信念'],
    ['corruption', 'n', '腐败'], ['defendant', 'n', '被告'], ['democracy', 'n', '民主'],
    ['diplomat', 'n', '外交官'], ['embargo', 'n', '禁运'], ['extradition', 'n', '引渡'],
    ['felony', 'n', '重罪'], ['governance', 'n', '治理'], ['immunity', 'n', '免疫/豁免'],
    ['indictment', 'n', '起诉'], ['jurisdiction', 'n', '管辖权'], ['lawsuit', 'n', '诉讼'],
    ['legislation', 'n', '立法'], ['litigation', 'n', '诉讼'], ['lobby', 'v', '游说'],
    ['magistrate', 'n', '地方法官'], ['parliament', 'n', '议会'], ['plaintiff', 'n', '原告'],
    ['prosecution', 'n', '起诉'], ['referendum', 'n', '全民投票'],
    ['sanction', 'n', '制裁'], ['sovereign', 'a', '主权的'], ['statute', 'n', '法规'],
    ['subpoena', 'n', '传票'], ['suffrage', 'n', '选举权'], ['tribunal', 'n', '法庭'],
    ['verdict', 'n', '裁决'], ['veto', 'n', '否决权'],
    // 教育文化
    ['alumni', 'n', '校友'], ['anthology', 'n', '选集'], ['archaeology', 'n', '考古学'],
    ['bibliography', 'n', '参考文献'], ['biography', 'n', '传记'],
    ['calligraphy', 'n', '书法'], ['campus', 'n', '校园'], ['chronicle', 'n', '编年史'],
    ['colloquial', 'a', '口语的'], ['compulsory', 'a', '义务的/强制的'],
    ['dean', 'n', '院长'], ['diploma', 'n', '毕业证书'], ['dissertation', 'n', '论文'],
    ['dormitory', 'n', '宿舍'], ['elective', 'n', '选修课'], ['encyclopedia', 'n', '百科全书'],
    ['excerpt', 'n', '摘录'], ['folklore', 'n', '民间传说'], ['heritage', 'n', '遗产'],
    ['hypothesis', 'n', '假设'], ['ideology', 'n', '意识形态'], ['linguistics', 'n', '语言学'],
    ['manuscript', 'n', '手稿'], ['mythology', 'n', '神话'], ['pedagogy', 'n', '教育学'],
    ['plagiarism', 'n', '抄袭'], ['proverb', 'n', '谚语'], ['rhetoric', 'n', '修辞学'],
    ['scholarship', 'n', '奖学金'], ['seminar', 'n', '研讨会'], ['syllabus', 'n', '教学大纲'],
    ['symposium', 'n', '研讨会'], ['thesis', 'n', '论文/论点'], ['tuition', 'n', '学费'],
    ['tutorial', 'n', '辅导课'],
  ],
  '学术科技': [
    // 计算机科技
    ['algorithm', 'n', '算法'], ['bandwidth', 'n', '带宽'], ['binary', 'a', '二进制的'],
    ['bluetooth', 'n', '蓝牙'], ['browser', 'n', '浏览器'], ['buffer', 'n', '缓冲区'],
    ['cache', 'n', '缓存'], ['cipher', 'n', '密码/加密'], ['compile', 'v', '编译'],
    ['configuration', 'n', '配置'], ['cursor', 'n', '光标'], ['cybersecurity', 'n', '网络安全'],
    ['database', 'n', '数据库'], ['debugger', 'n', '调试器'], ['decrypt', 'v', '解密'],
    ['download', 'v', '下载'], ['encryption', 'n', '加密'], ['ethernet', 'n', '以太网'],
    ['firmware', 'n', '固件'], ['gigabyte', 'n', '千兆字节'], ['hacker', 'n', '黑客'],
    ['hardware', 'n', '硬件'], ['hyperlink', 'n', '超链接'], ['interface', 'n', '接口'],
    ['iteration', 'n', '迭代'], ['latency', 'n', '延迟'], ['malware', 'n', '恶意软件'],
    ['metadata', 'n', '元数据'], ['middleware', 'n', '中间件'], ['module', 'n', '模块'],
    ['network', 'n', '网络'], ['node', 'n', '节点'], ['parameter', 'n', '参数'],
    ['peripheral', 'n', '外围设备'], ['pixel', 'n', '像素'], ['plugin', 'n', '插件'],
    ['processor', 'n', '处理器'], ['protocol', 'n', '协议'], ['proxy', 'n', '代理'],
    ['query', 'n', '查询'], ['reboot', 'v', '重启'], ['repository', 'n', '仓库'],
    ['router', 'n', '路由器'], ['scalable', 'a', '可扩展的'], ['screenshot', 'n', '截图'],
    ['server', 'n', '服务器'], ['socket', 'n', '套接字'], ['software', 'n', '软件'],
    ['spreadsheet', 'n', '电子表格'], ['synchronize', 'v', '同步'], ['template', 'n', '模板'],
    ['token', 'n', '令牌'], ['upload', 'v', '上传'], ['variable', 'n', '变量'],
    ['virtual', 'a', '虚拟的'], ['widget', 'n', '小部件'], ['wireless', 'a', '无线的'],
    // 自然科学
    ['absorption', 'n', '吸收'], ['acceleration', 'n', '加速度'], ['aerodynamics', 'n', '空气动力学'],
    ['amplitude', 'n', '振幅'], ['asteroid', 'n', '小行星'], ['astronomy', 'n', '天文学'],
    ['atom', 'n', '原子'], ['bacteria', 'n', '细菌'], ['biodiversity', 'n', '生物多样性'],
    ['botany', 'n', '植物学'], ['catalyst', 'n', '催化剂'], ['celsius', 'n', '摄氏度'],
    ['chromosome', 'n', '染色体'], ['compound', 'n', '化合物'], ['condensation', 'n', '冷凝'],
    ['constellation', 'n', '星座'], ['corrosion', 'n', '腐蚀'], ['crust', 'n', '地壳'],
    ['decompose', 'v', '分解'], ['density', 'n', '密度'], ['eclipse', 'n', '日食/月食'],
    ['ecosystem', 'n', '生态系统'], ['electrode', 'n', '电极'], ['electron', 'n', '电子'],
    ['element', 'n', '元素'], ['emission', 'n', '排放'], ['enzyme', 'n', '酶'],
    ['erosion', 'n', '侵蚀'], ['evaporation', 'n', '蒸发'], ['extinction', 'n', '灭绝'],
    ['fossil', 'n', '化石'], ['friction', 'n', '摩擦'], ['galaxy', 'n', '银河系'],
    ['genome', 'n', '基因组'], ['geology', 'n', '地质学'], ['glacier', 'n', '冰川'],
    ['gravity', 'n', '重力'], ['habitat', 'n', '栖息地'], ['hemisphere', 'n', '半球'],
    ['heredity', 'n', '遗传'], ['humidity', 'n', '湿度'], ['hurricane', 'n', '飓风'],
    ['hydrogen', 'n', '氢'], ['hypothesis', 'n', '假设'], ['isotope', 'n', '同位素'],
    ['kinetics', 'n', '动力学'], ['latitude', 'n', '纬度'], ['longitude', 'n', '经度'],
    ['magnitude', 'n', '大小/震级'], ['metabolism', 'n', '新陈代谢'],
    ['microscope', 'n', '显微镜'], ['molecule', 'n', '分子'], ['mutation', 'n', '突变'],
    ['nebula', 'n', '星云'], ['neutron', 'n', '中子'], ['nitrogen', 'n', '氮'],
    ['nucleus', 'n', '细胞核/原子核'], ['organism', 'n', '有机体'], ['osmosis', 'n', '渗透'],
    ['oxygen', 'n', '氧'], ['ozone', 'n', '臭氧'], ['parasite', 'n', '寄生虫'],
    ['photosynthesis', 'n', '光合作用'], ['plankton', 'n', '浮游生物'],
    ['plateau', 'n', '高原'], ['pollination', 'n', '授粉'], ['proton', 'n', '质子'],
    ['radiation', 'n', '辐射'], ['reagent', 'n', '试剂'], ['sediment', 'n', '沉积物'],
    ['seismology', 'n', '地震学'], ['solvent', 'n', '溶剂'], ['spectrum', 'n', '光谱'],
    ['stimulus', 'n', '刺激'], ['synthesis', 'n', '合成'], ['tectonic', 'a', '地壳构造的'],
    ['thermodynamics', 'n', '热力学'], ['tsunami', 'n', '海啸'], ['turbulence', 'n', '湍流'],
    ['ultraviolet', 'a', '紫外线的'], ['velocity', 'n', '速度'], ['vertebrate', 'n', '脊椎动物'],
    ['volcano', 'n', '火山'], ['wavelength', 'n', '波长'], ['zoology', 'n', '动物学'],
    // 医学
    ['anesthesia', 'n', '麻醉'], ['antibiotic', 'n', '抗生素'], ['cardiovascular', 'a', '心血管的'],
    ['chronic', 'a', '慢性的'], ['clinical', 'a', '临床的'], ['contagious', 'a', '传染性的'],
    ['dermatology', 'n', '皮肤病学'], ['dosage', 'n', '剂量'], ['epidemic', 'n', '流行病'],
    ['neurology', 'n', '神经学'], ['obstetrics', 'n', '产科'], ['oncology', 'n', '肿瘤学'],
    ['orthopedic', 'a', '骨科的'], ['pathology', 'n', '病理学'], ['pediatrics', 'n', '儿科'],
    ['prognosis', 'n', '预后'], ['psychiatry', 'n', '精神病学'], ['radiology', 'n', '放射学'],
    ['rehabilitation', 'n', '康复'], ['stethoscope', 'n', '听诊器'], ['surgical', 'a', '外科的'],
    ['transfusion', 'n', '输血'],
  ],
  '进阶词汇': [
    // 心理情感
    ['ambivalent', 'a', '矛盾的'], ['apprehension', 'n', '忧虑'], ['aversion', 'n', '厌恶'],
    ['benevolent', 'a', '仁慈的'], ['compassion', 'n', '同情'], ['compulsion', 'n', '强迫'],
    ['contempt', 'n', '蔑视'], ['conviction', 'n', '信念'], ['cynical', 'a', '愤世嫉俗的'],
    ['despair', 'n', '绝望'], ['dilemma', 'n', '困境'], ['disposition', 'n', '性情'],
    ['distress', 'n', '痛苦'], ['ecstasy', 'n', '狂喜'], ['empathy', 'n', '共情'],
    ['euphoria', 'n', '欣快感'], ['exhilaration', 'n', '兴奋'], ['frustration', 'n', '挫败感'],
    ['gratification', 'n', '满足'], ['grief', 'n', '悲伤'], ['humiliation', 'n', '羞辱'],
    ['indifference', 'n', '冷漠'], ['indignation', 'n', '愤慨'], ['insecurity', 'n', '不安全感'],
    ['jealousy', 'n', '嫉妒'], ['melancholy', 'n', '忧郁'], ['nostalgia', 'n', '怀旧'],
    ['obsession', 'n', '痴迷'], ['paranoia', 'n', '偏执'], ['resentment', 'n', '怨恨'],
    ['sentiment', 'n', '情感'], ['solitude', 'n', '孤独'], ['tranquility', 'n', '宁静'],
    ['vulnerability', 'n', '脆弱性'],
    // 高级形容词
    ['absurd', 'a', '荒谬的'], ['affluent', 'a', '富裕的'], ['ambiguous', 'a', '模糊的'],
    ['arduous', 'a', '艰难的'], ['assertive', 'a', '自信的'], ['audacious', 'a', '大胆的'],
    ['austere', 'a', '严峻的'], ['candid', 'a', '坦率的'], ['chronic', 'a', '慢性的'],
    ['coherent', 'a', '连贯的'], ['compelling', 'a', '令人信服的'], ['concise', 'a', '简洁的'],
    ['conspicuous', 'a', '显眼的'], ['contemptuous', 'a', '蔑视的'],
    ['defiant', 'a', '挑衅的'], ['diligent', 'a', '勤奋的'], ['discreet', 'a', '谨慎的'],
    ['dubious', 'a', '可疑的'], ['eccentric', 'a', '古怪的'], ['elusive', 'a', '难以捉摸的'],
    ['emphatic', 'a', '强调的'], ['erratic', 'a', '不稳定的'], ['exquisite', 'a', '精致的'],
    ['feasible', 'a', '可行的'], ['formidable', 'a', '可怕的'], ['frugal', 'a', '节俭的'],
    ['futile', 'a', '徒劳的'], ['genuine', 'a', '真正的'], ['gregarious', 'a', '合群的'],
    ['imminent', 'a', '即将发生的'], ['implicit', 'a', '含蓄的'], ['indigenous', 'a', '本土的'],
    ['inherent', 'a', '固有的'], ['insatiable', 'a', '贪得无厌的'],
    ['intricate', 'a', '复杂的'], ['intuitive', 'a', '直觉的'], ['lethargic', 'a', '昏昏欲睡的'],
    ['lucrative', 'a', '有利可图的'], ['meticulous', 'a', '一丝不苟的'],
    ['mundane', 'a', '平凡的'], ['nonchalant', 'a', '漫不经心的'],
    ['notorious', 'a', '臭名昭著的'], ['obscure', 'a', '晦涩的'], ['obsolete', 'a', '过时的'],
    ['ominous', 'a', '不祥的'], ['paramount', 'a', '至关重要的'],
    ['peculiar', 'a', '奇特的'], ['pervasive', 'a', '普遍的'], ['plausible', 'a', '似乎合理的'],
    ['pragmatic', 'a', '务实的'], ['precarious', 'a', '不稳定的'],
    ['prevalent', 'a', '流行的'], ['pristine', 'a', '原始的/崭新的'],
    ['profound', 'a', '深刻的'], ['prolific', 'a', '多产的'], ['prominent', 'a', '杰出的'],
    ['prudent', 'a', '谨慎的'], ['redundant', 'a', '多余的'], ['resilient', 'a', '有弹性的'],
    ['rigorous', 'a', '严格的'], ['robust', 'a', '健壮的'], ['scrupulous', 'a', '一丝不苟的'],
    ['skeptical', 'a', '怀疑的'], ['sporadic', 'a', '偶发的'], ['stringent', 'a', '严格的'],
    ['subtle', 'a', '微妙的'], ['superfluous', 'a', '多余的'], ['tentative', 'a', '试探性的'],
    ['thorough', 'a', '彻底的'], ['trivial', 'a', '琐碎的'], ['ubiquitous', 'a', '无处不在的'],
    ['unanimous', 'a', '一致同意的'], ['viable', 'a', '可行的'], ['vivid', 'a', '生动的'],
    ['volatile', 'a', '不稳定的/挥发的'], ['wholesome', 'a', '有益健康的'],
    // 高级动词
    ['abolish', 'v', '废除'], ['abstain', 'v', '戒绝'], ['accommodate', 'v', '容纳'],
    ['accumulate', 'v', '积累'], ['acquaint', 'v', '使熟悉'], ['aggravate', 'v', '加重'],
    ['alienate', 'v', '疏远'], ['alleviate', 'v', '减轻'], ['amalgamate', 'v', '合并'],
    ['amend', 'v', '修正'], ['annihilate', 'v', '消灭'], ['appease', 'v', '安抚'],
    ['articulate', 'v', '表达'], ['aspire', 'v', '渴望'], ['authenticate', 'v', '认证'],
    ['bewilder', 'v', '使迷惑'], ['bolster', 'v', '支持'], ['circumvent', 'v', '规避'],
    ['coerce', 'v', '强迫'], ['commemorate', 'v', '纪念'], ['compensate', 'v', '补偿'],
    ['concede', 'v', '承认'], ['confiscate', 'v', '没收'], ['consolidate', 'v', '巩固'],
    ['contemplate', 'v', '沉思'], ['contradict', 'v', '反驳'], ['converge', 'v', '汇聚'],
    ['cultivate', 'v', '培养'], ['debilitate', 'v', '削弱'], ['deceive', 'v', '欺骗'],
    ['demolish', 'v', '拆除'], ['denounce', 'v', '谴责'], ['deplete', 'v', '耗尽'],
    ['designate', 'v', '指定'], ['deteriorate', 'v', '恶化'], ['deviate', 'v', '偏离'],
    ['diminish', 'v', '减少'], ['discrepancy', 'n', '差异'], ['disperse', 'v', '分散'],
    ['elucidate', 'v', '阐明'], ['embark', 'v', '着手'], ['encompass', 'v', '包含'],
    ['endorse', 'v', '支持/背书'], ['eradicate', 'v', '根除'], ['escalate', 'v', '升级'],
    ['evacuate', 'v', '疏散'], ['exacerbate', 'v', '加剧'], ['exemplify', 'v', '例证'],
    ['extinguish', 'v', '熄灭'], ['fabricate', 'v', '捏造'], ['fluctuate', 'v', '波动'],
    ['formulate', 'v', '制定'], ['harness', 'v', '利用'], ['hinder', 'v', '阻碍'],
    ['impede', 'v', '妨碍'], ['implement', 'v', '实施'], ['inaugurate', 'v', '开创'],
    ['infer', 'v', '推断'], ['inhibit', 'v', '抑制'], ['instigate', 'v', '煽动'],
    ['interrogate', 'v', '审讯'], ['invoke', 'v', '援引'], ['jeopardize', 'v', '危及'],
    ['lament', 'v', '哀叹'], ['manifest', 'v', '表明'], ['mitigate', 'v', '减轻'],
    ['nourish', 'v', '滋养'], ['nurture', 'v', '培育'], ['obliterate', 'v', '抹去'],
    ['orchestrate', 'v', '策划'], ['perpetuate', 'v', '使持续'],
    ['precipitate', 'v', '促成'], ['procrastinate', 'v', '拖延'],
    ['proliferate', 'v', '激增'], ['provoke', 'v', '挑衅'],
    ['reconcile', 'v', '和解'], ['replenish', 'v', '补充'], ['scrutinize', 'v', '仔细审查'],
    ['stimulate', 'v', '刺激'], ['subsidize', 'v', '补贴'], ['suffocate', 'v', '窒息'],
    ['supplant', 'v', '取代'], ['suppress', 'v', '压制'], ['surmount', 'v', '克服'],
    ['transcend', 'v', '超越'], ['undermine', 'v', '暗中破坏'], ['vindicate', 'v', '证明正确'],
    ['withhold', 'v', '保留/扣留'],
    // 高级名词
    ['abstraction', 'n', '抽象'], ['adversary', 'n', '对手'], ['allegiance', 'n', '忠诚'],
    ['anecdote', 'n', '轶事'], ['anomaly', 'n', '异常'], ['antidote', 'n', '解毒剂'],
    ['apparatus', 'n', '装置'], ['archipelago', 'n', '群岛'], ['artifact', 'n', '人工制品'],
    ['asylum', 'n', '庇护'], ['atrocity', 'n', '暴行'], ['autonomy', 'n', '自治'],
    ['avalanche', 'n', '雪崩'], ['caliber', 'n', '口径/才能'], ['catalyst', 'n', '催化剂'],
    ['catastrophe', 'n', '灾难'], ['charisma', 'n', '魅力'], ['clout', 'n', '影响力'],
    ['collateral', 'n', '抵押品'], ['connoisseur', 'n', '鉴赏家'],
    ['consortium', 'n', '财团'], ['contingency', 'n', '意外事件'],
    ['conundrum', 'n', '难题'], ['debris', 'n', '碎片'], ['decorum', 'n', '礼仪'],
    ['dexterity', 'n', '灵巧'], ['dichotomy', 'n', '二分法'], ['doctrine', 'n', '教义'],
    ['drought', 'n', '干旱'], ['endeavor', 'n', '努力'], ['enigma', 'n', '谜'],
    ['epitome', 'n', '典范'], ['etiquette', 'n', '礼节'], ['fallacy', 'n', '谬误'],
    ['fiasco', 'n', '惨败'], ['frenzy', 'n', '狂热'], ['grievance', 'n', '不满'],
    ['havoc', 'n', '浩劫'], ['hierarchy', 'n', '等级制度'], ['impetus', 'n', '推动力'],
    ['inception', 'n', '开端'], ['integrity', 'n', '正直'], ['jargon', 'n', '行话'],
    ['legacy', 'n', '遗产'], ['leverage', 'n', '影响力'], ['loophole', 'n', '漏洞'],
    ['mayhem', 'n', '混乱'], ['metaphor', 'n', '隐喻'], ['milestone', 'n', '里程碑'],
    ['nemesis', 'n', '宿敌'], ['nuance', 'n', '细微差别'], ['panacea', 'n', '万能药'],
    ['paradigm', 'n', '范式'], ['paradox', 'n', '悖论'], ['pinnacle', 'n', '顶峰'],
    ['plethora', 'n', '过剩'], ['predicament', 'n', '困境'], ['prerogative', 'n', '特权'],
    ['ramification', 'n', '后果'], ['remnant', 'n', '残余'], ['repertoire', 'n', '全部技能'],
    ['repercussion', 'n', '反响'], ['rhetoric', 'n', '修辞'], ['saga', 'n', '长篇故事'],
    ['sanctuary', 'n', '圣所/庇护所'], ['scapegoat', 'n', '替罪羊'],
    ['stigma', 'n', '耻辱'], ['strife', 'n', '冲突'], ['synopsis', 'n', '概要'],
    ['threshold', 'n', '门槛'], ['turmoil', 'n', '动荡'], ['upheaval', 'n', '剧变'],
    ['utopia', 'n', '乌托邦'], ['vendetta', 'n', '仇恨'], ['zenith', 'n', '顶点'],
  ],
  '人文艺术': [
    ['aesthetic', 'a', '美学的'], ['allegory', 'n', '寓言'], ['canvas', 'n', '画布'],
    ['choreography', 'n', '编舞'], ['composer', 'n', '作曲家'], ['critique', 'n', '评论'],
    ['depict', 'v', '描绘'], ['easel', 'n', '画架'], ['exhibit', 'v', '展览'],
    ['genre', 'n', '体裁'], ['harmony', 'n', '和谐'], ['illustration', 'n', '插图'],
    ['improvise', 'v', '即兴创作'], ['lyric', 'n', '歌词'], ['masterpiece', 'n', '杰作'],
    ['melody', 'n', '旋律'], ['mural', 'n', '壁画'], ['narrative', 'n', '叙事'],
    ['orchestra', 'n', '管弦乐队'], ['palette', 'n', '调色板'], ['portrait', 'n', '肖像'],
    ['prose', 'n', '散文'], ['rhythm', 'n', '节奏'], ['sculpture', 'n', '雕塑'],
    ['sonnet', 'n', '十四行诗'], ['soprano', 'n', '女高音'], ['spectacle', 'n', '景象'],
    ['symphony', 'n', '交响乐'], ['texture', 'n', '质地'], ['verse', 'n', '诗句'],
    ['virtuoso', 'n', '大师'],
  ],
  '环境生态': [
    ['afforestation', 'n', '造林'], ['aquifer', 'n', '含水层'], ['arid', 'a', '干旱的'],
    ['atmosphere', 'n', '大气层'], ['biome', 'n', '生物群系'], ['biosphere', 'n', '生物圈'],
    ['carbon', 'n', '碳'], ['climate', 'n', '气候'], ['conservation', 'n', '保护'],
    ['contaminate', 'v', '污染'], ['deforestation', 'n', '砍伐森林'],
    ['desertification', 'n', '荒漠化'], ['ecology', 'n', '生态学'],
    ['effluent', 'n', '废水'], ['emission', 'n', '排放'], ['endangered', 'a', '濒危的'],
    ['estuary', 'n', '河口'], ['fauna', 'n', '动物群'], ['flora', 'n', '植物群'],
    ['geothermal', 'a', '地热的'], ['greenhouse', 'n', '温室'],
    ['groundwater', 'n', '地下水'], ['herbicide', 'n', '除草剂'], ['irrigation', 'n', '灌溉'],
    ['landfill', 'n', '垃圾填埋场'], ['permafrost', 'n', '永冻土'],
    ['pesticide', 'n', '杀虫剂'], ['photovoltaic', 'a', '光伏的'],
    ['pollutant', 'n', '污染物'], ['precipitation', 'n', '降水'],
    ['recycle', 'v', '回收'], ['renewable', 'a', '可再生的'],
    ['runoff', 'n', '径流'], ['sustainability', 'n', '可持续性'],
    ['tundra', 'n', '冻原'], ['watershed', 'n', '分水岭'], ['wetland', 'n', '湿地'],
  ],
  '哲学思辨': [
    ['altruism', 'n', '利他主义'], ['analogy', 'n', '类比'], ['axiom', 'n', '公理'],
    ['cognition', 'n', '认知'], ['conjecture', 'n', '推测'], ['consciousness', 'n', '意识'],
    ['deduction', 'n', '演绎'], ['determinism', 'n', '决定论'], ['dialectic', 'n', '辩证法'],
    ['dualism', 'n', '二元论'], ['empiricism', 'n', '经验主义'], ['epistemology', 'n', '认识论'],
    ['existentialism', 'n', '存在主义'], ['hedonism', 'n', '享乐主义'],
    ['humanism', 'n', '人文主义'], ['idealism', 'n', '理想主义'],
    ['induction', 'n', '归纳'], ['materialism', 'n', '唯物主义'],
    ['metaphysics', 'n', '形而上学'], ['nihilism', 'n', '虚无主义'],
    ['ontology', 'n', '本体论'], ['pessimism', 'n', '悲观主义'],
    ['pluralism', 'n', '多元主义'], ['positivism', 'n', '实证主义'],
    ['pragmatism', 'n', '实用主义'], ['rationalism', 'n', '理性主义'],
    ['relativism', 'n', '相对主义'], ['skepticism', 'n', '怀疑主义'],
    ['solipsism', 'n', '唯我论'], ['stoicism', 'n', '禁欲主义'],
    ['syllogism', 'n', '三段论'], ['utilitarianism', 'n', '功利主义'],
  ],
};

// Add supplement words, filtering duplicates
let addedSupplementWords = 0;
for (const [category, wordList] of Object.entries(newSupplementWords)) {
  if (!data.supplement[category]) {
    data.supplement[category] = [];
  }
  for (const [word, pos, meaning] of wordList) {
    const w = addWord(word, pos, meaning);
    if (w) {
      data.supplement[category].push(w);
      addedSupplementWords++;
    }
  }
}

console.log(`Added ${addedSupplementWords} new supplement words`);

// Update stats
let totalRootWords = 0;
data.roots.forEach(r => totalRootWords += r.words.length);
let totalSuppWords = 0;
Object.values(data.supplement).forEach(list => totalSuppWords += list.length);
const totalWords = totalRootWords + totalSuppWords;

data.stats = {
  rootCount: data.roots.length,
  rootWordCount: totalRootWords,
  supplementWordCount: totalSuppWords,
  totalWordCount: totalWords,
};

console.log(`\nFinal stats:`);
console.log(`Roots: ${data.roots.length}`);
console.log(`Root-based words: ${totalRootWords}`);
console.log(`Supplement words: ${totalSuppWords}`);
console.log(`Total: ${totalWords}`);

if (totalWords < 4000) {
  console.log(`\nNeed ${4000 - totalWords} more words to reach 4000. Adding more...`);

  // Add more words from various domains to reach 4000
  const extraWords = [
    // 商务金融
    ['acquisition', 'n', '收购'], ['allocation', 'n', '分配'], ['amortize', 'v', '分期偿还'],
    ['annuity', 'n', '年金'], ['appreciation', 'n', '增值/感激'], ['benchmark', 'n', '基准'],
    ['capitalization', 'n', '资本化'], ['collateral', 'n', '抵押品'],
    ['commodity', 'n', '商品'], ['compliance', 'n', '合规'], ['consortium', 'n', '财团'],
    ['depreciation', 'n', '折旧'], ['derivative', 'n', '衍生品'], ['disbursement', 'n', '支出'],
    ['diversification', 'n', '多样化'], ['downturn', 'n', '低迷'],
    ['equity', 'n', '股权'], ['escrow', 'n', '托管'], ['expenditure', 'n', '支出'],
    ['fiduciary', 'a', '信托的'], ['fluctuation', 'n', '波动'], ['forfeit', 'v', '丧失'],
    ['hedge', 'v', '对冲'], ['illiquid', 'a', '非流动的'], ['indemnity', 'n', '赔偿'],
    ['insolvency', 'n', '破产'], ['interest', 'n', '利息/兴趣'], ['liquidation', 'n', '清算'],
    ['maturity', 'n', '到期'], ['portfolio', 'n', '投资组合'], ['premium', 'n', '保费/溢价'],
    ['principal', 'n', '本金'], ['reimbursement', 'n', '报销'], ['remittance', 'n', '汇款'],
    ['securities', 'n', '证券'], ['solvency', 'n', '偿债能力'], ['stipend', 'n', '津贴'],
    ['subsidy', 'n', '补贴'], ['transaction', 'n', '交易'], ['underwrite', 'v', '承保'],
    ['yield', 'n', '收益率'],
    // 社会学/心理学
    ['acculturation', 'n', '文化适应'], ['alienation', 'n', '疏远'],
    ['altercation', 'n', '争吵'], ['anthropology', 'n', '人类学'],
    ['assimilation', 'n', '同化'], ['attrition', 'n', '消耗'],
    ['bourgeoisie', 'n', '资产阶级'], ['bureaucrat', 'n', '官僚'],
    ['conformity', 'n', '从众'], ['correlation', 'n', '相关性'],
    ['demographic', 'a', '人口统计的'], ['deviance', 'n', '偏差'],
    ['discrimination', 'n', '歧视'], ['disparity', 'n', '差距'],
    ['egalitarian', 'a', '平等主义的'], ['emigration', 'n', '移民(出)'],
    ['ethnocentrism', 'n', '种族中心主义'], ['gentrification', 'n', '中产阶级化'],
    ['globalization', 'n', '全球化'], ['immigration', 'n', '移民(入)'],
    ['industrialization', 'n', '工业化'], ['meritocracy', 'n', '精英制度'],
    ['patriarchy', 'n', '父权制'], ['proletariat', 'n', '无产阶级'],
    ['segregation', 'n', '隔离'], ['socialization', 'n', '社会化'],
    ['stratification', 'n', '分层'], ['urbanization', 'n', '城市化'],
    // 日常动词补充
    ['accompany', 'v', '陪伴'], ['acknowledge', 'v', '承认'], ['administer', 'v', '管理'],
    ['anticipate', 'v', '预期'], ['approximate', 'v', '接近'], ['arouse', 'v', '唤起'],
    ['assign', 'v', '分配'], ['authorize', 'v', '授权'], ['baffle', 'v', '使困惑'],
    ['bankrupt', 'v', '使破产'], ['bargain', 'v', '讨价还价'], ['bestow', 'v', '授予'],
    ['beware', 'v', '当心'], ['blunder', 'v', '犯错'], ['browse', 'v', '浏览'],
    ['captivate', 'v', '迷住'], ['cherish', 'v', '珍惜'], ['clench', 'v', '紧握'],
    ['coincide', 'v', '巧合'], ['commence', 'v', '开始'], ['compile', 'v', '编纂'],
    ['comply', 'v', '遵从'], ['conceive', 'v', '构想'], ['confide', 'v', '倾诉'],
    ['confront', 'v', '面对'], ['consent', 'v', '同意'], ['constitute', 'v', '构成'],
    ['constrain', 'v', '约束'], ['consult', 'v', '咨询'], ['contend', 'v', '竞争'],
    ['convene', 'v', '召集'], ['converse', 'v', '交谈'], ['crave', 'v', '渴望'],
    ['deem', 'v', '认为'], ['defer', 'v', '推迟'], ['defy', 'v', '违抗'],
    ['depict', 'v', '描述'], ['deploy', 'v', '部署'], ['derive', 'v', '源自'],
    ['detain', 'v', '拘留'], ['deter', 'v', '阻止'], ['discard', 'v', '丢弃'],
    ['disclose', 'v', '透露'], ['dispel', 'v', '驱散'], ['dispose', 'v', '处理'],
    ['disregard', 'v', '忽视'], ['distort', 'v', '歪曲'], ['divert', 'v', '转移'],
    ['dominate', 'v', '支配'], ['dwell', 'v', '居住'], ['elaborate', 'v', '详述'],
    ['embrace', 'v', '拥抱'], ['emit', 'v', '发出'], ['empathize', 'v', '共情'],
    ['enact', 'v', '颁布'], ['endow', 'v', '赋予'], ['engrave', 'v', '雕刻'],
    ['entail', 'v', '需要'], ['envision', 'v', '设想'], ['erode', 'v', '侵蚀'],
    ['evade', 'v', '逃避'], ['evoke', 'v', '唤起'], ['exert', 'v', '施加'],
    ['expel', 'v', '驱逐'], ['exploit', 'v', '利用'], ['extract', 'v', '提取'],
    ['facilitate', 'v', '促进'], ['forfeit', 'v', '丧失'], ['foster', 'v', '培养'],
    ['furnish', 'v', '提供'], ['gauge', 'v', '衡量'], ['glare', 'v', '怒视'],
    ['grieve', 'v', '悲伤'], ['hamper', 'v', '阻碍'], ['haunt', 'v', '萦绕'],
    ['herald', 'v', '预示'], ['immerse', 'v', '沉浸'], ['impair', 'v', '损害'],
    ['implore', 'v', '恳求'], ['impose', 'v', '施加'], ['incite', 'v', '煽动'],
    ['incorporate', 'v', '合并'], ['induce', 'v', '引起'], ['indulge', 'v', '放纵'],
    ['inherit', 'v', '继承'], ['initiate', 'v', '发起'], ['innovate', 'v', '创新'],
    ['insert', 'v', '插入'], ['integrate', 'v', '整合'], ['intercede', 'v', '调解'],
    ['intrigue', 'v', '引起兴趣'], ['inundate', 'v', '淹没'],
    ['linger', 'v', '逗留'], ['mediate', 'v', '调解'], ['mingle', 'v', '混合'],
    ['mobilize', 'v', '动员'], ['modify', 'v', '修改'], ['navigate', 'v', '导航'],
    ['negate', 'v', '否定'], ['neglect', 'v', '忽略'], ['obstruct', 'v', '阻碍'],
    ['opt', 'v', '选择'], ['outweigh', 'v', '超过'], ['overlap', 'v', '重叠'],
    ['override', 'v', '推翻'], ['overthrow', 'v', '推翻'], ['overwhelm', 'v', '压倒'],
    ['penetrate', 'v', '穿透'], ['petition', 'v', '请愿'], ['pledge', 'v', '承诺'],
    ['plunge', 'v', '跳入'], ['portray', 'v', '描绘'], ['precede', 'v', '先于'],
    ['proclaim', 'v', '宣告'], ['prolong', 'v', '延长'], ['propel', 'v', '推动'],
    ['prosecute', 'v', '起诉'], ['prosper', 'v', '繁荣'], ['provoke', 'v', '激起'],
    ['quench', 'v', '解渴/熄灭'], ['reassure', 'v', '使安心'],
    ['reckon', 'v', '认为/计算'], ['refrain', 'v', '克制'], ['refute', 'v', '反驳'],
    ['reinstate', 'v', '恢复'], ['relish', 'v', '享受'], ['remedy', 'v', '补救'],
    ['render', 'v', '使成为'], ['reproach', 'v', '责备'], ['resent', 'v', '怨恨'],
    ['resort', 'v', '求助于'], ['restrain', 'v', '克制'], ['retrieve', 'v', '取回'],
    ['revive', 'v', '复兴'], ['safeguard', 'v', '保护'], ['salvage', 'v', '打捞/挽救'],
    ['sanction', 'v', '批准/制裁'], ['shatter', 'v', '粉碎'], ['simulate', 'v', '模拟'],
    ['slash', 'v', '大幅削减'], ['smother', 'v', '闷住'], ['soar', 'v', '翱翔'],
    ['solicit', 'v', '恳求'], ['speculate', 'v', '推测'], ['squander', 'v', '浪费'],
    ['stagger', 'v', '蹒跚'], ['stifle', 'v', '扼杀'], ['stipulate', 'v', '规定'],
    ['strive', 'v', '努力'], ['submerge', 'v', '淹没'], ['summon', 'v', '召唤'],
    ['supersede', 'v', '取代'], ['supplement', 'v', '补充'], ['surge', 'v', '激增'],
    ['surmise', 'v', '推测'], ['sustain', 'v', '维持'], ['terminate', 'v', '终止'],
    ['testify', 'v', '作证'], ['thrive', 'v', '兴旺'], ['topple', 'v', '推翻'],
    ['trigger', 'v', '触发'], ['undertake', 'v', '承担'], ['unfold', 'v', '展开'],
    ['unravel', 'v', '解开'], ['uphold', 'v', '维护'], ['utilize', 'v', '利用'],
    ['utter', 'v', '说出'], ['vanish', 'v', '消失'], ['verify', 'v', '验证'],
    ['warrant', 'v', '保证'], ['wield', 'v', '运用'], ['withdraw', 'v', '撤回'],
    ['withstand', 'v', '承受'], ['yearn', 'v', '渴望'],
    // 日常名词补充
    ['accessory', 'n', '配件'], ['acumen', 'n', '敏锐'], ['affinity', 'n', '亲和力'],
    ['ailment', 'n', '小病'], ['ambiance', 'n', '氛围'], ['amenity', 'n', '设施'],
    ['anguish', 'n', '痛苦'], ['aperture', 'n', '光圈'], ['arbiter', 'n', '仲裁者'],
    ['aura', 'n', '光环'], ['backdrop', 'n', '背景'], ['blemish', 'n', '瑕疵'],
    ['blueprint', 'n', '蓝图'], ['calamity', 'n', '灾难'], ['camouflage', 'n', '伪装'],
    ['canvas', 'n', '帆布'], ['cascade', 'n', '瀑布'], ['chasm', 'n', '裂缝'],
    ['chronicle', 'n', '编年史'], ['clamor', 'n', '喧嚣'], ['clause', 'n', '条款'],
    ['clergy', 'n', '神职人员'], ['clientele', 'n', '客户群'], ['clique', 'n', '小团体'],
    ['coercion', 'n', '强制'], ['cognizance', 'n', '认知'], ['collusion', 'n', '串通'],
    ['commencement', 'n', '开始'], ['commodity', 'n', '商品'], ['compatriot', 'n', '同胞'],
    ['complacency', 'n', '自满'], ['concession', 'n', '让步'], ['condolence', 'n', '慰问'],
    ['confluence', 'n', '汇合'], ['connotation', 'n', '含义'],
    ['consensus', 'n', '共识'], ['constituent', 'n', '成分/选民'],
    ['contention', 'n', '论点'], ['contraband', 'n', '走私品'],
    ['convulsion', 'n', '痉挛'], ['cornerstone', 'n', '基石'],
    ['counterfeit', 'n', '伪造品'], ['covenant', 'n', '契约'],
    ['credibility', 'n', '可信度'], ['crux', 'n', '关键'],
    ['dearth', 'n', '缺乏'], ['decoy', 'n', '诱饵'],
    ['deficiency', 'n', '缺乏'], ['delicacy', 'n', '精致'],
    ['desolation', 'n', '荒凉'], ['detergent', 'n', '洗涤剂'],
    ['devout', 'a', '虔诚的'], ['dilemma', 'n', '两难'],
    ['discourse', 'n', '话语'], ['dominion', 'n', '统治'],
    ['dormant', 'a', '休眠的'], ['dynasty', 'n', '王朝'],
    ['echelon', 'n', '等级'], ['embargo', 'n', '禁运'],
    ['emblem', 'n', '徽章'], ['endeavor', 'n', '努力'],
    ['epoch', 'n', '时代'], ['equilibrium', 'n', '平衡'],
    ['rift', 'n', '裂痕'], ['sabbatical', 'n', '休假'],
    ['tenure', 'n', '任期'], ['tycoon', 'n', '大亨'],
  ];

  if (!data.supplement['综合扩展']) {
    data.supplement['综合扩展'] = [];
  }

  for (const [word, pos, meaning] of extraWords) {
    const w = addWord(word, pos, meaning);
    if (w) {
      data.supplement['综合扩展'].push(w);
      addedSupplementWords++;
    }
  }

  // Recalculate
  totalRootWords = 0;
  data.roots.forEach(r => totalRootWords += r.words.length);
  totalSuppWords = 0;
  Object.values(data.supplement).forEach(list => totalSuppWords += list.length);
  const newTotal = totalRootWords + totalSuppWords;

  data.stats = {
    rootCount: data.roots.length,
    rootWordCount: totalRootWords,
    supplementWordCount: totalSuppWords,
    totalWordCount: newTotal,
  };

  console.log(`\nUpdated stats:`);
  console.log(`Roots: ${data.roots.length}`);
  console.log(`Root-based words: ${totalRootWords}`);
  console.log(`Supplement words: ${totalSuppWords}`);
  console.log(`Total: ${newTotal}`);
}

// Write the expanded data
fs.writeFileSync(rawPath, JSON.stringify(data, null, 0));
console.log(`\nWrote expanded database to ${rawPath}`);
console.log(`File size: ${(fs.statSync(rawPath).size / 1024).toFixed(1)} KB`);
