#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, '..', 'src', 'data', 'wordDatabaseRaw.json');
const data = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

const existingWords = new Set();
data.roots.forEach(r => r.words.forEach(w => existingWords.add(w.word.toLowerCase())));
Object.values(data.supplement).forEach(list => list.forEach(w => existingWords.add(w.word.toLowerCase())));

console.log(`Current total: ${existingWords.size}`);

const addWord = (word, pos, meaning) => {
  if (existingWords.has(word.toLowerCase())) return null;
  existingWords.add(word.toLowerCase());
  return { word, pos, meaning };
};

// More roots to add
const moreRoots = [
  {
    id: 'ling', root: 'ling', meaning: '语言', origin: '拉丁语 lingua', color: '#E67E22', level: 5,
    words: [
      ['language', 'n', '语言'], ['linguistic', 'a', '语言学的'], ['bilingual', 'a', '双语的'],
      ['multilingual', 'a', '多语的'], ['slang', 'n', '俚语'], ['lingo', 'n', '行话'],
    ]
  },
  {
    id: 'carn', root: 'carn', meaning: '肉', origin: '拉丁语 caro', color: '#E74C3C', level: 6,
    words: [
      ['carnival', 'n', '嘉年华'], ['carnivore', 'n', '食肉动物'], ['incarnate', 'a', '化身的'],
      ['reincarnation', 'n', '轮回'], ['carnal', 'a', '肉体的'],
    ]
  },
  {
    id: 'chron', root: 'chron', meaning: '时间', origin: '希腊语 chronos', color: '#3498DB', level: 5,
    words: [
      ['chronic', 'a', '长期的'], ['chronicle', 'n', '编年史'], ['chronological', 'a', '按时间顺序的'],
      ['chronology', 'n', '年表'], ['synchronize', 'v', '同步'], ['anachronism', 'n', '时代错误'],
    ]
  },
  {
    id: 'morph', root: 'morph', meaning: '形态', origin: '希腊语 morphe', color: '#9B59B6', level: 6,
    words: [
      ['morphology', 'n', '形态学'], ['metamorphosis', 'n', '变形'], ['amorphous', 'a', '无定形的'],
      ['anthropomorphic', 'a', '拟人化的'], ['polymorphism', 'n', '多态性'],
    ]
  },
  {
    id: 'phil', root: 'phil', meaning: '爱', origin: '希腊语 philos', color: '#E91E63', level: 5,
    words: [
      ['philosophy', 'n', '哲学'], ['philosopher', 'n', '哲学家'], ['philanthropy', 'n', '慈善'],
      ['bibliophile', 'n', '书迷'], ['philharmonic', 'a', '爱好音乐的'],
    ]
  },
  {
    id: 'crypt', root: 'crypt', meaning: '隐藏', origin: '希腊语 kryptos', color: '#2C3E50', level: 6,
    words: [
      ['encrypt', 'v', '加密'], ['decrypt', 'v', '解密'], ['cryptic', 'a', '神秘的'],
      ['cryptography', 'n', '密码学'], ['crypt', 'n', '地窖'],
    ]
  },
  {
    id: 'dem', root: 'dem', meaning: '人民', origin: '希腊语 demos', color: '#E67E22', level: 4,
    words: [
      ['democracy', 'n', '民主'], ['democrat', 'n', '民主党人'], ['democratic', 'a', '民主的'],
      ['demographic', 'a', '人口的'], ['epidemic', 'n', '流行病'], ['pandemic', 'n', '大流行'],
      ['endemic', 'a', '地方性的'],
    ]
  },
  {
    id: 'arch', root: 'arch', meaning: '统治/首要', origin: '希腊语 arche', color: '#8E44AD', level: 5,
    words: [
      ['monarchy', 'n', '君主制'], ['anarchy', 'n', '无政府状态'], ['architect', 'n', '建筑师'],
      ['architecture', 'n', '建筑'], ['hierarchy', 'n', '等级制度'], ['matriarch', 'n', '女族长'],
      ['patriarch', 'n', '男族长'], ['archive', 'n', '档案'],
    ]
  },
  {
    id: 'civ', root: 'civ', meaning: '公民', origin: '拉丁语 civis', color: '#27AE60', level: 4,
    words: [
      ['civil', 'a', '公民的'], ['civilian', 'n', '平民'], ['civilization', 'n', '文明'],
      ['civilize', 'v', '使文明'], ['civic', 'a', '市政的'],
    ]
  },
  {
    id: 'greg', root: 'greg', meaning: '群/聚集', origin: '拉丁语 grex', color: '#16A085', level: 6,
    words: [
      ['aggregate', 'v', '聚集'], ['congregation', 'n', '聚会'], ['gregarious', 'a', '爱交际的'],
      ['segregate', 'v', '隔离'],
    ]
  },
];

let addedRootWords = 0;
for (const root of moreRoots) {
  const validWords = [];
  for (const [word, pos, meaning] of root.words) {
    const w = addWord(word, pos, meaning);
    if (w) validWords.push(w);
  }
  if (validWords.length > 0) {
    data.roots.push({
      id: root.id, root: root.root, meaning: root.meaning,
      origin: root.origin, color: root.color, level: root.level,
      words: validWords,
    });
    addedRootWords += validWords.length;
  }
}
console.log(`Added ${addedRootWords} new root words`);

// Large batch of additional words across categories
const moreWords = {
  '日常基础': [
    ['abandon', 'v', '放弃'], ['abide', 'v', '遵守'], ['absorb', 'v', '吸收'],
    ['abundant', 'a', '丰富的'], ['abuse', 'n', '滥用'], ['accomplish', 'v', '完成'],
    ['accurate', 'a', '准确的'], ['accuse', 'v', '指控'], ['accustom', 'v', '使习惯'],
    ['achieve', 'v', '达到'], ['acid', 'n', '酸'], ['acute', 'a', '敏锐的'],
    ['adequate', 'a', '充分的'], ['adjacent', 'a', '邻近的'], ['adolescent', 'n', '青少年'],
    ['adverse', 'a', '不利的'], ['affection', 'n', '感情'], ['afford', 'v', '买得起'],
    ['aggregate', 'n', '总计'], ['agile', 'a', '敏捷的'], ['alliance', 'n', '联盟'],
    ['altitude', 'n', '海拔'], ['amateur', 'n', '业余爱好者'], ['ambition', 'n', '雄心'],
    ['ample', 'a', '充足的'], ['anchor', 'n', '锚'], ['anonymous', 'a', '匿名的'],
    ['antenna', 'n', '天线'], ['anxiety', 'n', '焦虑'], ['apology', 'n', '道歉'],
    ['appliance', 'n', '电器'], ['arbitrary', 'a', '任意的'], ['arena', 'n', '竞技场'],
    ['arithmetic', 'n', '算术'], ['array', 'n', '数组/排列'], ['arrogant', 'a', '傲慢的'],
    ['assemble', 'v', '集合'], ['assert', 'v', '断言'], ['asset', 'n', '资产'],
    ['attain', 'v', '达到'], ['attribute', 'n', '属性'], ['authentic', 'a', '真实的'],
    ['avenue', 'n', '大道'], ['awkward', 'a', '尴尬的'], ['axis', 'n', '轴'],
    ['bachelor', 'n', '单身汉/学士'], ['banner', 'n', '横幅'], ['bargain', 'n', '便宜货'],
    ['barrel', 'n', '桶'], ['barrier', 'n', '障碍'], ['basin', 'n', '盆地'],
    ['batch', 'n', '批次'], ['behalf', 'n', '代表'], ['bias', 'n', '偏见'],
    ['blend', 'v', '混合'], ['blossom', 'n', '花朵'], ['blunt', 'a', '钝的'],
    ['bold', 'a', '大胆的'], ['boom', 'n', '繁荣'], ['bounce', 'v', '弹跳'],
    ['bound', 'a', '受约束的'], ['boycott', 'v', '抵制'], ['breach', 'n', '违反'],
    ['brisk', 'a', '轻快的'], ['brittle', 'a', '脆的'], ['brochure', 'n', '小册子'],
    ['bronze', 'n', '青铜'], ['brutal', 'a', '残忍的'], ['bulk', 'n', '大量'],
    ['burden', 'n', '负担'], ['bureau', 'n', '局/办公室'], ['cabin', 'n', '小屋'],
    ['cancel', 'v', '取消'], ['capable', 'a', '有能力的'], ['capsule', 'n', '胶囊'],
    ['capture', 'v', '捕获'], ['carve', 'v', '雕刻'], ['casualty', 'n', '伤亡'],
    ['catalog', 'n', '目录'], ['caution', 'n', '谨慎'], ['cease', 'v', '停止'],
    ['ceremony', 'n', '仪式'], ['chaos', 'n', '混乱'], ['charm', 'n', '魅力'],
    ['chronic', 'a', '慢性的'], ['circuit', 'n', '电路'], ['circumstance', 'n', '情况'],
    ['civic', 'a', '公民的'], ['clamp', 'v', '夹紧'], ['clash', 'n', '冲突'],
    ['classic', 'a', '经典的'], ['clergy', 'n', '牧师'], ['cliff', 'n', '悬崖'],
    ['cluster', 'n', '群'], ['coalition', 'n', '联盟'], ['cognitive', 'a', '认知的'],
    ['collapse', 'v', '倒塌'], ['collide', 'v', '碰撞'], ['column', 'n', '列/柱'],
    ['combat', 'n', '战斗'], ['commence', 'v', '开始'], ['compact', 'a', '紧凑的'],
    ['compatible', 'a', '兼容的'], ['compel', 'v', '强迫'],
    ['competent', 'a', '有能力的'], ['complement', 'n', '补充'],
    ['compromise', 'v', '妥协'], ['compulsory', 'a', '强制的'],
    ['conceal', 'v', '隐藏'], ['concentrate', 'v', '集中'],
    ['concrete', 'a', '具体的'], ['condemn', 'v', '谴责'],
    ['confine', 'v', '限制'], ['conform', 'v', '遵守'],
    ['conquer', 'v', '征服'], ['conscience', 'n', '良心'],
    ['consecutive', 'a', '连续的'], ['consent', 'n', '同意'],
    ['conserve', 'v', '节约'], ['considerable', 'a', '相当的'],
    ['console', 'v', '安慰'], ['conspire', 'v', '密谋'],
    ['constitution', 'n', '宪法'], ['contempt', 'n', '藐视'],
    ['content', 'a', '满意的'], ['context', 'n', '背景'],
    ['contrast', 'n', '对比'], ['contribute', 'v', '贡献'],
    ['controversy', 'n', '争议'], ['convention', 'n', '惯例'],
    ['convey', 'v', '传达'], ['convince', 'v', '说服'],
    ['cooperate', 'v', '合作'], ['cope', 'v', '应对'],
    ['coral', 'n', '珊瑚'], ['core', 'n', '核心'],
    ['correspond', 'v', '对应'], ['council', 'n', '委员会'],
    ['counsel', 'n', '建议'], ['counter', 'n', '柜台'],
    ['courage', 'n', '勇气'], ['courtesy', 'n', '礼貌'],
    ['craft', 'n', '工艺'], ['crash', 'v', '撞毁'],
    ['crawl', 'v', '爬行'], ['creative', 'a', '创造性的'],
    ['crew', 'n', '机组人员'], ['criterion', 'n', '标准'],
    ['crucial', 'a', '关键的'], ['crush', 'v', '压碎'],
    ['crystal', 'n', '水晶'], ['cubic', 'a', '立方的'],
    ['curriculum', 'n', '课程'], ['custom', 'n', '习俗'],
    ['cylinder', 'n', '圆柱'], ['dawn', 'n', '黎明'],
    ['deaf', 'a', '聋的'], ['debate', 'n', '辩论'],
    ['debris', 'n', '残骸'], ['decade', 'n', '十年'],
    ['decay', 'v', '衰变'], ['decent', 'a', '体面的'],
    ['decline', 'v', '下降'], ['decorate', 'v', '装饰'],
    ['decree', 'n', '法令'], ['defect', 'n', '缺陷'],
    ['deficit', 'n', '赤字'], ['definite', 'a', '明确的'],
    ['defy', 'v', '蔑视'], ['delight', 'n', '高兴'],
    ['delusion', 'n', '错觉'], ['democracy', 'n', '民主'],
    ['denial', 'n', '否认'], ['dense', 'a', '密集的'],
    ['deny', 'v', '否认'], ['departure', 'n', '离开'],
    ['deposit', 'n', '存款'], ['deprive', 'v', '剥夺'],
    ['deputy', 'n', '代理人'], ['descend', 'v', '下降'],
    ['desert', 'n', '沙漠'], ['destiny', 'n', '命运'],
    ['detect', 'v', '检测'], ['device', 'n', '设备'],
    ['devote', 'v', '致力于'], ['dial', 'v', '拨号'],
    ['dictate', 'v', '口述'], ['dignity', 'n', '尊严'],
    ['dim', 'a', '暗淡的'], ['dimension', 'n', '维度'],
    ['diploma', 'n', '文凭'], ['discipline', 'n', '纪律'],
    ['discourse', 'n', '论述'], ['discrete', 'a', '离散的'],
    ['disguise', 'v', '伪装'], ['dismiss', 'v', '解散'],
    ['dispatch', 'v', '派遣'], ['display', 'v', '展示'],
    ['dispute', 'n', '争端'], ['dissolve', 'v', '溶解'],
    ['distinct', 'a', '明显的'], ['distort', 'v', '扭曲'],
    ['distribute', 'v', '分发'], ['divine', 'a', '神圣的'],
    ['doctrine', 'n', '教条'], ['domain', 'n', '领域'],
    ['domestic', 'a', '国内的'], ['dominant', 'a', '占主导的'],
    ['donate', 'v', '捐赠'], ['dose', 'n', '剂量'],
    ['doubtful', 'a', '怀疑的'], ['draft', 'n', '草稿'],
    ['drain', 'v', '排水'], ['drama', 'n', '戏剧'],
    ['drastic', 'a', '激烈的'], ['drift', 'v', '漂流'],
    ['dumb', 'a', '哑的'], ['dump', 'v', '倾倒'],
    ['duplicate', 'v', '复制'], ['dusk', 'n', '黄昏'],
    ['dwarf', 'n', '矮人'], ['dynamic', 'a', '动态的'],
    ['eager', 'a', '渴望的'], ['earnest', 'a', '认真的'],
    ['edge', 'n', '边缘'], ['editorial', 'n', '社论'],
    ['ego', 'n', '自我'], ['elaborate', 'a', '精心的'],
    ['elegant', 'a', '优雅的'], ['eligible', 'a', '合格的'],
    ['eliminate', 'v', '消除'], ['elite', 'n', '精英'],
    ['embrace', 'v', '拥抱'], ['emergence', 'n', '出现'],
    ['emit', 'v', '发射'], ['emotion', 'n', '情感'],
    ['emperor', 'n', '皇帝'], ['emphasis', 'n', '强调'],
    ['empire', 'n', '帝国'], ['enable', 'v', '使能够'],
    ['encounter', 'v', '遭遇'], ['endorse', 'v', '背书'],
    ['enforce', 'v', '执行'], ['engage', 'v', '从事'],
    ['enhance', 'v', '增强'], ['enlighten', 'v', '启发'],
    ['enterprise', 'n', '企业'], ['enthusiasm', 'n', '热情'],
    ['entity', 'n', '实体'], ['envelope', 'n', '信封'],
    ['environment', 'n', '环境'], ['envy', 'n', '嫉妒'],
    ['equip', 'v', '装备'], ['equivalent', 'a', '等价的'],
    ['era', 'n', '时代'], ['erect', 'v', '建立'],
    ['errand', 'n', '差事'], ['essay', 'n', '论文'],
    ['essence', 'n', '本质'], ['estate', 'n', '房产'],
    ['eternal', 'a', '永恒的'], ['ethnic', 'a', '民族的'],
    ['evaporate', 'v', '蒸发'], ['eventual', 'a', '最终的'],
    ['evident', 'a', '明显的'], ['evil', 'a', '邪恶的'],
    ['evolve', 'v', '进化'], ['exaggerate', 'v', '夸张'],
    ['exceed', 'v', '超过'], ['excel', 'v', '擅长'],
    ['excessive', 'a', '过度的'], ['exclaim', 'v', '惊呼'],
    ['exclusive', 'a', '排他的'], ['execute', 'v', '执行'],
    ['exempt', 'a', '免除的'], ['exhaust', 'v', '耗尽'],
    ['exotic', 'a', '异国的'], ['expedition', 'n', '远征'],
    ['expend', 'v', '花费'], ['expertise', 'n', '专业知识'],
    ['explicit', 'a', '明确的'], ['extent', 'n', '程度'],
    ['exterior', 'a', '外部的'], ['extinct', 'a', '灭绝的'],
    ['extraordinary', 'a', '非凡的'], ['extreme', 'a', '极端的'],
    ['fabric', 'n', '织物'], ['facility', 'n', '设施'],
    ['faculty', 'n', '能力/学院'], ['fade', 'v', '褪色'],
    ['famine', 'n', '饥荒'], ['fantasy', 'n', '幻想'],
    ['fascinate', 'v', '迷住'], ['fatal', 'a', '致命的'],
    ['feast', 'n', '盛宴'], ['federal', 'a', '联邦的'],
    ['feeble', 'a', '虚弱的'], ['fertile', 'a', '肥沃的'],
    ['fiber', 'n', '纤维'], ['fierce', 'a', '凶猛的'],
    ['flaw', 'n', '缺陷'], ['flesh', 'n', '肉体'],
    ['flexible', 'a', '灵活的'], ['flock', 'n', '群'],
    ['fluid', 'n', '流体'], ['flush', 'v', '冲洗'],
    ['foam', 'n', '泡沫'], ['folk', 'n', '人们'],
    ['forbid', 'v', '禁止'], ['forecast', 'n', '预报'],
    ['forge', 'v', '锻造'], ['format', 'n', '格式'],
    ['formula', 'n', '公式'], ['fraction', 'n', '分数'],
    ['fragment', 'n', '碎片'], ['framework', 'n', '框架'],
    ['frontier', 'n', '边疆'], ['frustrate', 'v', '挫败'],
    ['fulfill', 'v', '实现'], ['fundamental', 'a', '基本的'],
    ['funeral', 'n', '葬礼'], ['furious', 'a', '狂怒的'],
  ],
  '社会生活': [
    ['abortion', 'n', '流产'], ['abstract', 'a', '抽象的'],
    ['academy', 'n', '学院'], ['accelerate', 'v', '加速'],
    ['accessible', 'a', '可进入的'], ['acclaim', 'n', '称赞'],
    ['accumulate', 'v', '积累'], ['acquaintance', 'n', '熟人'],
    ['adolescence', 'n', '青春期'], ['adoption', 'n', '收养/采纳'],
    ['advocate', 'n', '倡导者'], ['affiliate', 'v', '附属'],
    ['aggression', 'n', '侵略'], ['albeit', 'conj', '尽管'],
    ['analogy', 'n', '类比'], ['ancestry', 'n', '祖先'],
    ['appraisal', 'n', '评估'], ['apprenticeship', 'n', '学徒制'],
    ['arbitrary', 'a', '任意的'], ['aspiration', 'n', '志向'],
    ['assurance', 'n', '保证'], ['asylum', 'n', '庇护所'],
    ['attorney', 'n', '律师'], ['authentic', 'a', '正宗的'],
    ['autonomy', 'n', '自治'], ['ballot', 'n', '投票'],
    ['beneficiary', 'n', '受益人'], ['benign', 'a', '良性的'],
    ['bilateral', 'a', '双边的'], ['bribery', 'n', '贿赂'],
    ['bureaucratic', 'a', '官僚的'], ['casualty', 'n', '伤亡人员'],
    ['catastrophic', 'a', '灾难性的'], ['censorship', 'n', '审查'],
    ['chronic', 'a', '慢性的'], ['coherence', 'n', '连贯性'],
    ['commemoration', 'n', '纪念'], ['compassionate', 'a', '有同情心的'],
    ['competence', 'n', '能力'], ['concession', 'n', '让步'],
    ['conscientious', 'a', '认真的'], ['consensus', 'n', '共识'],
    ['conspiracy', 'n', '阴谋'], ['constraint', 'n', '约束'],
    ['controversy', 'n', '争论'], ['correspondence', 'n', '通信'],
    ['critique', 'n', '批评'], ['culmination', 'n', '顶点'],
    ['custody', 'n', '监护'], ['cynicism', 'n', '犬儒主义'],
    ['delegation', 'n', '代表团'], ['deliberation', 'n', '审议'],
    ['demographic', 'n', '人口特征'], ['denounce', 'v', '谴责'],
    ['deprivation', 'n', '剥夺'], ['detention', 'n', '拘留'],
    ['devolution', 'n', '权力下放'], ['diplomacy', 'n', '外交'],
    ['disciplinary', 'a', '纪律的'], ['discretion', 'n', '谨慎'],
    ['dissent', 'n', '异议'], ['dissolution', 'n', '解散'],
    ['diversity', 'n', '多样性'], ['duality', 'n', '双重性'],
    ['dysfunction', 'n', '功能障碍'], ['emancipation', 'n', '解放'],
    ['embezzlement', 'n', '贪污'], ['empowerment', 'n', '赋权'],
    ['endorsement', 'n', '支持'], ['escalation', 'n', '升级'],
    ['espionage', 'n', '间谍活动'], ['ethical', 'a', '伦理的'],
    ['exclusion', 'n', '排斥'], ['exploitation', 'n', '剥削'],
    ['extremism', 'n', '极端主义'], ['fiscal', 'a', '财政的'],
    ['fraternity', 'n', '兄弟会'], ['genocide', 'n', '种族灭绝'],
    ['geopolitical', 'a', '地缘政治的'], ['grievance', 'n', '不满'],
    ['harassment', 'n', '骚扰'], ['humanitarian', 'a', '人道主义的'],
    ['ideology', 'n', '意识形态'], ['impartiality', 'n', '公正'],
    ['impeachment', 'n', '弹劾'], ['implementation', 'n', '实施'],
    ['implication', 'n', '含义'], ['inaugural', 'a', '就职的'],
    ['inequality', 'n', '不平等'], ['infrastructure', 'n', '基础设施'],
    ['injustice', 'n', '不公正'], ['insurgency', 'n', '叛乱'],
    ['intervention', 'n', '干预'], ['intimidation', 'n', '恐吓'],
  ],
  '学术科技': [
    ['acoustic', 'a', '声学的'], ['aerospace', 'n', '航空航天'],
    ['alloy', 'n', '合金'], ['apparatus', 'n', '仪器'],
    ['artifact', 'n', '人工制品'], ['autonomous', 'a', '自主的'],
    ['biometric', 'a', '生物识别的'], ['calibrate', 'v', '校准'],
    ['capacitor', 'n', '电容器'], ['centrifuge', 'n', '离心机'],
    ['clone', 'v', '克隆'], ['combustion', 'n', '燃烧'],
    ['composite', 'a', '复合的'], ['conductor', 'n', '导体'],
    ['convex', 'a', '凸的'], ['cryogenic', 'a', '低温的'],
    ['decipher', 'v', '破译'], ['diffusion', 'n', '扩散'],
    ['diode', 'n', '二极管'], ['displacement', 'n', '位移'],
    ['distillation', 'n', '蒸馏'], ['elasticity', 'n', '弹性'],
    ['electromagnetic', 'a', '电磁的'], ['embryo', 'n', '胚胎'],
    ['equilibrium', 'n', '平衡'], ['fission', 'n', '裂变'],
    ['fluorescent', 'a', '荧光的'], ['frequency', 'n', '频率'],
    ['fusion', 'n', '融合'], ['genome', 'n', '基因组'],
    ['geothermal', 'a', '地热的'], ['hologram', 'n', '全息图'],
    ['hybrid', 'a', '混合的'], ['inertia', 'n', '惯性'],
    ['infrared', 'a', '红外的'], ['insulate', 'v', '隔离'],
    ['kinetic', 'a', '动力的'], ['laser', 'n', '激光'],
    ['magnet', 'n', '磁铁'], ['membrane', 'n', '膜'],
    ['momentum', 'n', '动量'], ['nanometer', 'n', '纳米'],
    ['nanotechnology', 'n', '纳米技术'], ['optics', 'n', '光学'],
    ['oscillation', 'n', '振荡'], ['pathogen', 'n', '病原体'],
    ['peptide', 'n', '肽'], ['phenomenon', 'n', '现象'],
    ['plasma', 'n', '等离子体'], ['polymer', 'n', '聚合物'],
    ['propagation', 'n', '传播'], ['quantum', 'n', '量子'],
    ['radioactive', 'a', '放射性的'], ['reactor', 'n', '反应堆'],
    ['refraction', 'n', '折射'], ['semiconductor', 'n', '半导体'],
    ['soluble', 'a', '可溶的'], ['static', 'a', '静态的'],
    ['substrate', 'n', '基质'], ['supersonic', 'a', '超音速的'],
    ['tensor', 'n', '张量'], ['thermal', 'a', '热的'],
    ['topology', 'n', '拓扑学'], ['transistor', 'n', '晶体管'],
    ['viscosity', 'n', '粘度'], ['watt', 'n', '瓦特'],
  ],
};

let addedSuppWords = 0;
for (const [category, wordList] of Object.entries(moreWords)) {
  if (!data.supplement[category]) data.supplement[category] = [];
  for (const [word, pos, meaning] of wordList) {
    const w = addWord(word, pos, meaning);
    if (w) {
      data.supplement[category].push(w);
      addedSuppWords++;
    }
  }
}
console.log(`Added ${addedSuppWords} more supplement words`);

// Final stats
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

console.log(`\nFinal: Roots=${data.roots.length}, RootWords=${totalRootWords}, Supp=${totalSuppWords}, Total=${totalWords}`);

fs.writeFileSync(rawPath, JSON.stringify(data, null, 0));
console.log(`Written. Size: ${(fs.statSync(rawPath).size / 1024).toFixed(1)} KB`);
