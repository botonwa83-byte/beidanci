/**
 * 猜词模块数据（独立精选，不依赖主词库）。
 *
 * 卖点：让用户体验"猜词超能力"——再长再陌生的单词，只要拆开词根词缀就能猜出意思。
 *
 * 选词原则：
 *  - 以名词为主，偏长、偏难（死记很痛苦，但懂词根就秒懂）
 *  - 词根词缀"透明"：拆解后的含义能直接推出整词意思，保证用户一定猜得出
 *  - 拆解覆盖整个单词的每一个字母：词根/词缀是 morpheme，中间的连接字母是 link
 *    （link 在 UI 上显示在括号外，这样用户看到的永远是完整单词，不会是缺字母的碎片）
 *
 * 数据自检：模块加载时校验每个词 segments 拼接 === word，开发期不一致会在控制台报警。
 */

export type SegmentType = 'prefix' | 'root' | 'suffix' | 'link';

export interface GuessSegment {
  text: string;
  type: SegmentType;
  meaning?: string; // link 类型（连接字母）无含义
}

export interface GuessWord {
  word: string;
  phonetic: string;
  pos: string;
  meaning: string; // 中文释义（答案）
  hint: string; // 词根义如何拼出整词义
  segments: GuessSegment[];
}

const P = (text: string, meaning: string): GuessSegment => ({type: 'prefix', text, meaning});
const R = (text: string, meaning: string): GuessSegment => ({type: 'root', text, meaning});
const S = (text: string, meaning: string): GuessSegment => ({type: 'suffix', text, meaning});
const L = (text: string): GuessSegment => ({type: 'link', text});

export const guessWords: GuessWord[] = [
  {
    word: 'circumnavigation', phonetic: '/ˌsɜːkəmˌnævɪˈɡeɪʃn/', pos: 'n.',
    meaning: '环球航行', hint: '环绕 + 航行 + 名词 → 绕着地球航行一圈',
    segments: [P('circum', '环绕'), R('navig', '航行（navis 船）'), S('ation', '名词')],
  },
  {
    word: 'transportation', phonetic: '/ˌtrænspɔːˈteɪʃn/', pos: 'n.',
    meaning: '运输；交通', hint: '横越 + 搬运 + 名词 → 把东西搬到远处',
    segments: [P('trans', '横越、转移'), R('port', '搬运'), S('ation', '名词')],
  },
  {
    word: 'autobiography', phonetic: '/ˌɔːtəbaɪˈɒɡrəfi/', pos: 'n.',
    meaning: '自传', hint: '自己 + 生命 + 书写 → 写自己一生的书',
    segments: [P('auto', '自己'), R('bio', '生命'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'biography', phonetic: '/baɪˈɒɡrəfi/', pos: 'n.',
    meaning: '传记', hint: '生命 + 书写 → 写某人一生的书',
    segments: [R('bio', '生命'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'bibliography', phonetic: '/ˌbɪbliˈɒɡrəfi/', pos: 'n.',
    meaning: '参考书目', hint: '书 + 书写 → 把用到的书写成一份清单',
    segments: [R('biblio', '书'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'calligraphy', phonetic: '/kəˈlɪɡrəfi/', pos: 'n.',
    meaning: '书法', hint: '美 + 书写 → 写得漂亮的字',
    segments: [R('calli', '美'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'geography', phonetic: '/dʒiˈɒɡrəfi/', pos: 'n.',
    meaning: '地理学', hint: '大地 + 书写 → 描述大地的学问',
    segments: [R('geo', '大地'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'photography', phonetic: '/fəˈtɒɡrəfi/', pos: 'n.',
    meaning: '摄影', hint: '光 + 书写 → 用光来作画',
    segments: [R('photo', '光'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'telescope', phonetic: '/ˈtelɪskəʊp/', pos: 'n.',
    meaning: '望远镜', hint: '远 + 看 → 看远处的工具',
    segments: [P('tele', '远'), R('scope', '看')],
  },
  {
    word: 'microscope', phonetic: '/ˈmaɪkrəskəʊp/', pos: 'n.',
    meaning: '显微镜', hint: '微小 + 看 → 看微小东西的工具',
    segments: [P('micro', '微小'), R('scope', '看')],
  },
  {
    word: 'thermometer', phonetic: '/θəˈmɒmɪtə/', pos: 'n.',
    meaning: '温度计', hint: '热/温度 + 测量器 → 量温度的仪器',
    segments: [R('thermo', '热、温度'), R('meter', '测量器')],
  },
  {
    word: 'chronometer', phonetic: '/krəˈnɒmɪtə/', pos: 'n.',
    meaning: '精密计时器', hint: '时间 + 测量器 → 精确量时间的仪器',
    segments: [R('chrono', '时间'), R('meter', '测量器')],
  },
  {
    word: 'barometer', phonetic: '/bəˈrɒmɪtə/', pos: 'n.',
    meaning: '气压计', hint: '压力 + 测量器 → 量气压的仪器',
    segments: [R('baro', '压力、重'), R('meter', '测量器')],
  },
  {
    word: 'speedometer', phonetic: '/spiˈdɒmɪtə/', pos: 'n.',
    meaning: '速度计；里程表', hint: '速度 +（连接 o）+ 测量器 → 量速度的仪表',
    segments: [R('speed', '速度'), L('o'), R('meter', '测量器')],
  },
  {
    word: 'democracy', phonetic: '/dɪˈmɒkrəsi/', pos: 'n.',
    meaning: '民主（制）', hint: '人民 + 统治 → 由人民来统治',
    segments: [R('demo', '人民'), R('cracy', '统治')],
  },
  {
    word: 'bureaucracy', phonetic: '/bjʊəˈrɒkrəsi/', pos: 'n.',
    meaning: '官僚体制', hint: '办公局 + 统治 → 由各级办公部门来统治',
    segments: [R('bureau', '办公局'), R('cracy', '统治')],
  },
  {
    word: 'aristocracy', phonetic: '/ˌærɪˈstɒkrəsi/', pos: 'n.',
    meaning: '贵族统治；贵族阶层', hint: '最优秀者 + 统治 → 由“最好的人”统治',
    segments: [R('aristo', '最优秀的人'), R('cracy', '统治')],
  },
  {
    word: 'philosophy', phonetic: '/fɪˈlɒsəfi/', pos: 'n.',
    meaning: '哲学', hint: '爱 + 智慧 + 名词 → 对智慧的热爱',
    segments: [R('philo', '爱'), R('soph', '智慧'), S('y', '名词')],
  },
  {
    word: 'manuscript', phonetic: '/ˈmænjuskrɪpt/', pos: 'n.',
    meaning: '手稿', hint: '手 + 书写 → 用手写出来的稿子',
    segments: [R('manu', '手'), R('script', '书写')],
  },
  {
    word: 'inscription', phonetic: '/ɪnˈskrɪpʃn/', pos: 'n.',
    meaning: '铭文；题词', hint: '在……上 + 书写 + 名词 → 刻写在物体上的字',
    segments: [P('in', '在……上'), R('script', '书写'), S('ion', '名词')],
  },
  {
    word: 'benefactor', phonetic: '/ˈbenɪfæktə/', pos: 'n.',
    meaning: '恩人；捐助者', hint: '好 + 做 + 人 → 做好事的人',
    segments: [P('bene', '好'), R('fact', '做'), S('or', '……的人')],
  },
  {
    word: 'manufacture', phonetic: '/ˌmænjuˈfæktʃə/', pos: 'n.',
    meaning: '制造（业）', hint: '手 + 做 + 名词 → 用手把东西做出来',
    segments: [R('manu', '手'), R('fact', '做'), S('ure', '名词')],
  },
  {
    word: 'agriculture', phonetic: '/ˈæɡrɪkʌltʃə/', pos: 'n.',
    meaning: '农业', hint: '田地 + 耕种 + 名词 → 耕种田地',
    segments: [R('agri', '田地'), R('cult', '耕种'), S('ure', '名词')],
  },
  {
    word: 'horticulture', phonetic: '/ˈhɔːtɪkʌltʃə/', pos: 'n.',
    meaning: '园艺', hint: '花园 + 耕种 + 名词 → 经营花园',
    segments: [R('horti', '花园'), R('cult', '耕种'), S('ure', '名词')],
  },
  {
    word: 'omnivore', phonetic: '/ˈɒmnɪvɔː/', pos: 'n.',
    meaning: '杂食动物', hint: '全部 +（连接 i）+ 吃 → 什么都吃的动物',
    segments: [R('omn', '全部'), L('i'), R('vore', '吃')],
  },
  {
    word: 'carnivore', phonetic: '/ˈkɑːnɪvɔː/', pos: 'n.',
    meaning: '食肉动物', hint: '肉 +（连接 i）+ 吃 → 吃肉的动物',
    segments: [R('carn', '肉'), L('i'), R('vore', '吃')],
  },
  {
    word: 'herbivore', phonetic: '/ˈhɜːbɪvɔː/', pos: 'n.',
    meaning: '食草动物', hint: '草 +（连接 i）+ 吃 → 吃草的动物',
    segments: [R('herb', '草、植物'), L('i'), R('vore', '吃')],
  },
  {
    word: 'insecticide', phonetic: '/ɪnˈsektɪsaɪd/', pos: 'n.',
    meaning: '杀虫剂', hint: '昆虫 +（连接 i）+ 杀 → 杀昆虫的药',
    segments: [R('insect', '昆虫'), L('i'), R('cide', '杀')],
  },
  {
    word: 'herbicide', phonetic: '/ˈhɜːbɪsaɪd/', pos: 'n.',
    meaning: '除草剂', hint: '草 +（连接 i）+ 杀 → 杀草的药',
    segments: [R('herb', '草'), L('i'), R('cide', '杀')],
  },
  {
    word: 'genocide', phonetic: '/ˈdʒenəsaɪd/', pos: 'n.',
    meaning: '种族灭绝', hint: '种族 + 杀 → 把整个种族杀光',
    segments: [R('geno', '种族'), R('cide', '杀')],
  },
  {
    word: 'circumference', phonetic: '/səˈkʌmfərəns/', pos: 'n.',
    meaning: '圆周；周长', hint: '环绕 + 带/延伸 + 名词 → 绕一圈的长度',
    segments: [P('circum', '环绕'), R('fer', '带、延伸'), S('ence', '名词')],
  },
  {
    word: 'aqueduct', phonetic: '/ˈækwɪdʌkt/', pos: 'n.',
    meaning: '引水渠；渡槽', hint: '水 + 引导 → 把水引过来的渠道',
    segments: [R('aque', '水'), R('duct', '引导')],
  },
  {
    word: 'introduction', phonetic: '/ˌɪntrəˈdʌkʃn/', pos: 'n.',
    meaning: '引言；介绍', hint: '向内 + 引导 + 名词 → 把人/话题引进来',
    segments: [P('intro', '向内'), R('duct', '引导'), S('ion', '名词')],
  },
  {
    word: 'conductor', phonetic: '/kənˈdʌktə/', pos: 'n.',
    meaning: '导体；指挥；售票员', hint: '共同 + 引导 + ……者 → 引导（电流/乐队）的人或物',
    segments: [P('con', '共同'), R('duct', '引导'), S('or', '……者/物')],
  },
  {
    word: 'misanthrope', phonetic: '/ˈmɪzənθrəʊp/', pos: 'n.',
    meaning: '厌世者；憎恶人类的人', hint: '厌恶 + 人类 → 讨厌人类的人',
    segments: [P('mis', '厌恶'), R('anthrope', '人类')],
  },
  {
    word: 'philanthropist', phonetic: '/fɪˈlænθrəpɪst/', pos: 'n.',
    meaning: '慈善家', hint: '爱 + 人类 + ……的人 → 博爱世人的人',
    segments: [R('phil', '爱'), R('anthrop', '人类'), S('ist', '……的人')],
  },
  {
    word: 'anthropology', phonetic: '/ˌænθrəˈpɒlədʒi/', pos: 'n.',
    meaning: '人类学', hint: '人类 + 学科 → 研究人类的学问',
    segments: [R('anthropo', '人类'), R('logy', '学科')],
  },
  {
    word: 'psychology', phonetic: '/saɪˈkɒlədʒi/', pos: 'n.',
    meaning: '心理学', hint: '心理/灵魂 + 学科 → 研究心理的学问',
    segments: [R('psycho', '心理、灵魂'), R('logy', '学科')],
  },
  {
    word: 'archaeology', phonetic: '/ˌɑːkiˈɒlədʒi/', pos: 'n.',
    meaning: '考古学', hint: '远古 + 学科 → 研究远古的学问',
    segments: [R('archaeo', '远古'), R('logy', '学科')],
  },
  {
    word: 'dermatology', phonetic: '/ˌdɜːməˈtɒlədʒi/', pos: 'n.',
    meaning: '皮肤病学', hint: '皮肤 + 学科 → 研究皮肤的医学',
    segments: [R('dermato', '皮肤'), R('logy', '学科')],
  },
  {
    word: 'ornithology', phonetic: '/ˌɔːnɪˈθɒlədʒi/', pos: 'n.',
    meaning: '鸟类学', hint: '鸟 + 学科 → 研究鸟类的学问',
    segments: [R('ornitho', '鸟'), R('logy', '学科')],
  },
  {
    word: 'etymology', phonetic: '/ˌetɪˈmɒlədʒi/', pos: 'n.',
    meaning: '词源学', hint: '词的本义 + 学科 → 研究词来源的学问',
    segments: [R('etymo', '词的本义'), R('logy', '学科')],
  },
  {
    word: 'cardiologist', phonetic: '/ˌkɑːdiˈɒlədʒɪst/', pos: 'n.',
    meaning: '心脏病专家', hint: '心脏 + 学 + ……的人 → 研究心脏的医生',
    segments: [R('cardio', '心脏'), R('log', '学'), S('ist', '……的人')],
  },
  {
    word: 'orthodontist', phonetic: '/ˌɔːθəˈdɒntɪst/', pos: 'n.',
    meaning: '牙齿矫正医生', hint: '正/直 + 牙齿 + ……的人 → 把牙齿弄整齐的医生',
    segments: [R('ortho', '正、直'), R('dont', '牙齿'), S('ist', '……的人')],
  },
  {
    word: 'pediatrician', phonetic: '/ˌpiːdiəˈtrɪʃn/', pos: 'n.',
    meaning: '儿科医生', hint: '儿童 + 医治 + 专家 → 治儿童病的医生',
    segments: [R('pedi', '儿童'), R('atr', '医治'), S('ician', '专家')],
  },
  {
    word: 'hydroelectricity', phonetic: '/ˌhaɪdrəʊɪlekˈtrɪsəti/', pos: 'n.',
    meaning: '水力发电', hint: '水 + 电 + 名词 → 用水发出的电',
    segments: [R('hydro', '水'), R('electr', '电'), S('icity', '名词')],
  },
  {
    word: 'thermodynamics', phonetic: '/ˌθɜːməʊdaɪˈnæmɪks/', pos: 'n.',
    meaning: '热力学', hint: '热 + 力 + 学科 → 研究热与能量的学问',
    segments: [R('thermo', '热'), R('dynam', '力、能'), S('ics', '学科')],
  },
  {
    word: 'astronomy', phonetic: '/əˈstrɒnəmi/', pos: 'n.',
    meaning: '天文学', hint: '星 + 规律/学 → 研究星辰运行规律',
    segments: [R('astro', '星'), R('nomy', '规律、学')],
  },
  {
    word: 'astronaut', phonetic: '/ˈæstrənɔːt/', pos: 'n.',
    meaning: '宇航员', hint: '星 + 航行者 → 在星空中航行的人',
    segments: [R('astro', '星'), R('naut', '航行者')],
  },
  {
    word: 'aeronautics', phonetic: '/ˌeərəˈnɔːtɪks/', pos: 'n.',
    meaning: '航空学', hint: '空中 + 航行 + 学科 → 研究空中航行的学问',
    segments: [R('aero', '空气、飞行'), R('naut', '航行'), S('ics', '学科')],
  },
  {
    word: 'hippopotamus', phonetic: '/ˌhɪpəˈpɒtəməs/', pos: 'n.',
    meaning: '河马', hint: '马 + 河 + 名词 → 生活在河里的“马”',
    segments: [R('hippo', '马'), R('potam', '河'), S('us', '名词')],
  },
  {
    word: 'metamorphosis', phonetic: '/ˌmetəˈmɔːfəsɪs/', pos: 'n.',
    meaning: '蜕变；变形', hint: '变化 + 形态 + 过程 → 形态发生彻底改变',
    segments: [P('meta', '变化'), R('morph', '形态'), S('osis', '过程、状态')],
  },
  {
    word: 'photosynthesis', phonetic: '/ˌfəʊtəʊˈsɪnθəsɪs/', pos: 'n.',
    meaning: '光合作用', hint: '光 + 共同 + 放置/合成 → 借助光合成养分',
    segments: [R('photo', '光'), P('syn', '共同'), R('thesis', '放置、合成')],
  },
  {
    word: 'hypothesis', phonetic: '/haɪˈpɒθəsɪs/', pos: 'n.',
    meaning: '假设', hint: '在下面 + 放置 → 放在底下当前提的说法',
    segments: [P('hypo', '在下面'), R('thesis', '放置')],
  },
  {
    word: 'antithesis', phonetic: '/ænˈtɪθəsɪs/', pos: 'n.',
    meaning: '对立面；对照', hint: '相反 + 放置 → 放在对立位置的东西',
    segments: [P('anti', '相反'), R('thesis', '放置')],
  },
  {
    word: 'monologue', phonetic: '/ˈmɒnəlɒɡ/', pos: 'n.',
    meaning: '独白', hint: '单一 + 说话 → 一个人在说话',
    segments: [P('mono', '单一'), R('logue', '说话')],
  },
  {
    word: 'dialogue', phonetic: '/ˈdaɪəlɒɡ/', pos: 'n.',
    meaning: '对话', hint: '之间 + 说话 → 双方之间互相说话',
    segments: [P('dia', '之间、穿过'), R('logue', '说话')],
  },
  {
    word: 'prologue', phonetic: '/ˈprəʊlɒɡ/', pos: 'n.',
    meaning: '序言；开场白', hint: '在前 + 说话 → 正文前先说的话',
    segments: [P('pro', '在前'), R('logue', '说话')],
  },
  {
    word: 'epilogue', phonetic: '/ˈepɪlɒɡ/', pos: 'n.',
    meaning: '尾声；结语', hint: '在后 + 说话 → 正文后补说的话',
    segments: [P('epi', '在后、在上'), R('logue', '说话')],
  },
  {
    word: 'monarchy', phonetic: '/ˈmɒnəki/', pos: 'n.',
    meaning: '君主制', hint: '单一 + 统治 → 一个人（君主）统治',
    segments: [P('mon', '单一'), R('archy', '统治')],
  },
  {
    word: 'anarchy', phonetic: '/ˈænəki/', pos: 'n.',
    meaning: '无政府状态', hint: '无 + 统治 → 没有人统治',
    segments: [P('an', '无'), R('archy', '统治')],
  },
  {
    word: 'hierarchy', phonetic: '/ˈhaɪərɑːki/', pos: 'n.',
    meaning: '等级制度', hint: '等级/神圣 + 统治 → 按层级来统治',
    segments: [R('hier', '等级、神圣'), R('archy', '统治')],
  },
  {
    word: 'oligarchy', phonetic: '/ˈɒlɪɡɑːki/', pos: 'n.',
    meaning: '寡头政治', hint: '少数 + 统治 → 极少数人统治',
    segments: [R('olig', '少数'), R('archy', '统治')],
  },
  {
    word: 'pseudonym', phonetic: '/ˈsuːdənɪm/', pos: 'n.',
    meaning: '笔名；假名', hint: '假 + 名字 → 假的名字',
    segments: [P('pseudo', '假'), R('nym', '名字')],
  },
  {
    word: 'synonym', phonetic: '/ˈsɪnənɪm/', pos: 'n.',
    meaning: '同义词', hint: '相同 + 名字 → 意思相同的词',
    segments: [P('syn', '相同'), R('onym', '名字')],
  },
  {
    word: 'antonym', phonetic: '/ˈæntənɪm/', pos: 'n.',
    meaning: '反义词', hint: '相反 + 名字 → 意思相反的词',
    segments: [P('ant', '相反'), R('onym', '名字')],
  },
  {
    word: 'acronym', phonetic: '/ˈækrənɪm/', pos: 'n.',
    meaning: '首字母缩略词', hint: '顶端/首 + 名字 → 取每个词开头拼成的名字',
    segments: [R('acr', '顶端、首'), R('onym', '名字')],
  },
  {
    word: 'bibliophile', phonetic: '/ˈbɪbliəfaɪl/', pos: 'n.',
    meaning: '爱书者；藏书家', hint: '书 + 爱好者 → 极爱书的人',
    segments: [R('biblio', '书'), R('phile', '爱好者')],
  },
  {
    word: 'megalomania', phonetic: '/ˌmeɡələˈmeɪniə/', pos: 'n.',
    meaning: '夸大狂；妄自尊大', hint: '大 + 狂热 → 自以为伟大的狂热',
    segments: [R('megalo', '大'), R('mania', '狂热')],
  },
  {
    word: 'kleptomania', phonetic: '/ˌkleptəˈmeɪniə/', pos: 'n.',
    meaning: '盗窃癖', hint: '偷窃 + 狂癖 → 控制不住要偷的癖好',
    segments: [R('klepto', '偷窃'), R('mania', '狂癖')],
  },
  {
    word: 'insomnia', phonetic: '/ɪnˈsɒmniə/', pos: 'n.',
    meaning: '失眠（症）', hint: '无 + 睡眠 + 症状 → 睡不着的毛病',
    segments: [P('in', '无、不'), R('somn', '睡眠'), S('ia', '症状')],
  },
  {
    word: 'somnambulist', phonetic: '/sɒmˈnæmbjʊlɪst/', pos: 'n.',
    meaning: '梦游者', hint: '睡眠 + 行走 + ……的人 → 睡着了还走路的人',
    segments: [R('somn', '睡眠'), R('ambul', '行走'), S('ist', '……的人')],
  },
  {
    word: 'claustrophobia', phonetic: '/ˌklɔːstrəˈfəʊbiə/', pos: 'n.',
    meaning: '幽闭恐惧症', hint: '封闭空间 + 恐惧 → 害怕狭小封闭空间',
    segments: [R('claustro', '封闭空间'), R('phobia', '恐惧')],
  },
  {
    word: 'xenophobia', phonetic: '/ˌzenəˈfəʊbiə/', pos: 'n.',
    meaning: '仇外；排外', hint: '外国人 + 恐惧 → 害怕/憎恶外国人',
    segments: [R('xeno', '外国人、陌生'), R('phobia', '恐惧')],
  },
  {
    word: 'acrophobia', phonetic: '/ˌækrəˈfəʊbiə/', pos: 'n.',
    meaning: '恐高症', hint: '高处 + 恐惧 → 害怕高处',
    segments: [R('acro', '高处'), R('phobia', '恐惧')],
  },
  {
    word: 'hydrophobia', phonetic: '/ˌhaɪdrəˈfəʊbiə/', pos: 'n.',
    meaning: '恐水症；狂犬病', hint: '水 + 恐惧 → 害怕水',
    segments: [R('hydro', '水'), R('phobia', '恐惧')],
  },

  // ==================== -graph 书写/记录 ====================
  {
    word: 'choreography', phonetic: '/ˌkɒriˈɒɡrəfi/', pos: 'n.',
    meaning: '编舞（艺术）', hint: '舞蹈 + 书写 → 把舞步“写”下来',
    segments: [R('choreo', '舞蹈'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'oceanography', phonetic: '/ˌəʊʃəˈnɒɡrəfi/', pos: 'n.',
    meaning: '海洋学', hint: '海洋 +（连接 o）+ 书写 → 描述海洋的学问',
    segments: [R('ocean', '海洋'), L('o'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'cartography', phonetic: '/kɑːˈtɒɡrəfi/', pos: 'n.',
    meaning: '制图学', hint: '地图 + 书写 → 绘制地图的学问',
    segments: [R('carto', '地图'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'demography', phonetic: '/dɪˈmɒɡrəfi/', pos: 'n.',
    meaning: '人口统计学', hint: '人民 + 书写 → 记录人口数据的学问',
    segments: [R('demo', '人民'), R('graph', '书写'), S('y', '名词')],
  },
  {
    word: 'telegraph', phonetic: '/ˈtelɪɡrɑːf/', pos: 'n.',
    meaning: '电报（机）', hint: '远 + 书写 → 把字传到远处',
    segments: [P('tele', '远'), R('graph', '书写')],
  },
  {
    word: 'paragraph', phonetic: '/ˈpærəɡrɑːf/', pos: 'n.',
    meaning: '段落', hint: '旁边 + 书写 → 旁边另起一行写的一段',
    segments: [P('para', '旁边'), R('graph', '书写')],
  },
  {
    word: 'seismograph', phonetic: '/ˈsaɪzməɡrɑːf/', pos: 'n.',
    meaning: '地震仪', hint: '地震 + 记录 → 记录地震的仪器',
    segments: [R('seismo', '地震'), R('graph', '记录')],
  },
  {
    word: 'phonograph', phonetic: '/ˈfəʊnəɡrɑːf/', pos: 'n.',
    meaning: '留声机', hint: '声音 + 记录 → 记录声音的机器',
    segments: [R('phono', '声音'), R('graph', '记录')],
  },
  {
    word: 'monograph', phonetic: '/ˈmɒnəɡrɑːf/', pos: 'n.',
    meaning: '专著', hint: '单一 + 书写 → 专写单一题目的著作',
    segments: [P('mono', '单一'), R('graph', '书写')],
  },

  // ==================== -logy 学科 ====================
  {
    word: 'biology', phonetic: '/baɪˈɒlədʒi/', pos: 'n.',
    meaning: '生物学', hint: '生命 + 学科 → 研究生命的学问',
    segments: [R('bio', '生命'), R('logy', '学科')],
  },
  {
    word: 'geology', phonetic: '/dʒiˈɒlədʒi/', pos: 'n.',
    meaning: '地质学', hint: '大地 + 学科 → 研究大地构造的学问',
    segments: [R('geo', '大地'), R('logy', '学科')],
  },
  {
    word: 'zoology', phonetic: '/zuˈɒlədʒi/', pos: 'n.',
    meaning: '动物学', hint: '动物 + 学科 → 研究动物的学问',
    segments: [R('zoo', '动物'), R('logy', '学科')],
  },
  {
    word: 'theology', phonetic: '/θiˈɒlədʒi/', pos: 'n.',
    meaning: '神学', hint: '神 + 学科 → 研究神与信仰的学问',
    segments: [R('theo', '神'), R('logy', '学科')],
  },
  {
    word: 'mythology', phonetic: '/mɪˈθɒlədʒi/', pos: 'n.',
    meaning: '神话（学）', hint: '神话 + 学科 → 研究神话的学问',
    segments: [R('mytho', '神话'), R('logy', '学科')],
  },
  {
    word: 'technology', phonetic: '/tekˈnɒlədʒi/', pos: 'n.',
    meaning: '科技；技术', hint: '技艺 + 学科 → 关于技艺的系统知识',
    segments: [R('techno', '技艺、技术'), R('logy', '学科')],
  },
  {
    word: 'chronology', phonetic: '/krəˈnɒlədʒi/', pos: 'n.',
    meaning: '年表；年代学', hint: '时间 + 学科 → 按时间排序的学问',
    segments: [R('chrono', '时间'), R('logy', '学科')],
  },
  {
    word: 'ecology', phonetic: '/iˈkɒlədʒi/', pos: 'n.',
    meaning: '生态学', hint: '环境/家 + 学科 → 研究生物与环境的学问',
    segments: [R('eco', '环境、家'), R('logy', '学科')],
  },
  {
    word: 'neurology', phonetic: '/njʊˈrɒlədʒi/', pos: 'n.',
    meaning: '神经病学', hint: '神经 + 学科 → 研究神经的医学',
    segments: [R('neuro', '神经'), R('logy', '学科')],
  },
  {
    word: 'cosmology', phonetic: '/kɒzˈmɒlədʒi/', pos: 'n.',
    meaning: '宇宙学', hint: '宇宙 + 学科 → 研究宇宙的学问',
    segments: [R('cosmo', '宇宙'), R('logy', '学科')],
  },
  {
    word: 'meteorology', phonetic: '/ˌmiːtiəˈrɒlədʒi/', pos: 'n.',
    meaning: '气象学', hint: '大气现象 + 学科 → 研究天气的学问',
    segments: [R('meteoro', '大气现象'), R('logy', '学科')],
  },
  {
    word: 'physiology', phonetic: '/ˌfɪziˈɒlədʒi/', pos: 'n.',
    meaning: '生理学', hint: '身体机能 + 学科 → 研究身体如何运作',
    segments: [R('physio', '身体机能'), R('logy', '学科')],
  },
  {
    word: 'sociology', phonetic: '/ˌsəʊsiˈɒlədʒi/', pos: 'n.',
    meaning: '社会学', hint: '社会 + 学科 → 研究社会的学问',
    segments: [R('socio', '社会'), R('logy', '学科')],
  },
  {
    word: 'methodology', phonetic: '/ˌmeθəˈdɒlədʒi/', pos: 'n.',
    meaning: '方法论', hint: '方法 +（连接 o）+ 学科 → 关于方法的系统理论',
    segments: [R('method', '方法'), L('o'), R('logy', '学科')],
  },
  {
    word: 'genealogy', phonetic: '/ˌdʒiːniˈælədʒi/', pos: 'n.',
    meaning: '家谱；宗谱学', hint: '家系 + 学科 → 研究家族血脉的学问',
    segments: [R('genea', '家系'), R('logy', '学科')],
  },
  {
    word: 'pathology', phonetic: '/pəˈθɒlədʒi/', pos: 'n.',
    meaning: '病理学', hint: '疾病 + 学科 → 研究疾病的学问',
    segments: [R('patho', '疾病'), R('logy', '学科')],
  },

  // ==================== -logist / -ician 专业人士 ====================
  {
    word: 'biologist', phonetic: '/baɪˈɒlədʒɪst/', pos: 'n.',
    meaning: '生物学家', hint: '生命 + 学 + ……的人 → 研究生命的人',
    segments: [R('bio', '生命'), R('log', '学'), S('ist', '……的人')],
  },
  {
    word: 'psychologist', phonetic: '/saɪˈkɒlədʒɪst/', pos: 'n.',
    meaning: '心理学家', hint: '心理 + 学 + ……的人 → 研究心理的人',
    segments: [R('psycho', '心理'), R('log', '学'), S('ist', '……的人')],
  },
  {
    word: 'archaeologist', phonetic: '/ˌɑːkiˈɒlədʒɪst/', pos: 'n.',
    meaning: '考古学家', hint: '远古 + 学 + ……的人 → 研究远古的人',
    segments: [R('archaeo', '远古'), R('log', '学'), S('ist', '……的人')],
  },
  {
    word: 'anthropologist', phonetic: '/ˌænθrəˈpɒlədʒɪst/', pos: 'n.',
    meaning: '人类学家', hint: '人类 + 学 + ……的人 → 研究人类的人',
    segments: [R('anthropo', '人类'), R('log', '学'), S('ist', '……的人')],
  },
  {
    word: 'physicist', phonetic: '/ˈfɪzɪsɪst/', pos: 'n.',
    meaning: '物理学家', hint: '自然/物理 + ……的人 → 研究物理的人',
    segments: [R('physic', '自然、物理'), S('ist', '……的人')],
  },
  {
    word: 'technician', phonetic: '/tekˈnɪʃn/', pos: 'n.',
    meaning: '技师；技术员', hint: '技术 + 专家 → 懂技术的人',
    segments: [R('techn', '技术'), S('ician', '专家')],
  },
  {
    word: 'electrician', phonetic: '/ɪˌlekˈtrɪʃn/', pos: 'n.',
    meaning: '电工', hint: '电 + 专家 → 跟电打交道的人',
    segments: [R('electr', '电'), S('ician', '专家')],
  },
  {
    word: 'physician', phonetic: '/fɪˈzɪʃn/', pos: 'n.',
    meaning: '医生；内科医生', hint: '自然/身体 + 专家 → 懂身体的人',
    segments: [R('physic', '自然、身体'), S('ian', '……的人')],
  },
  {
    word: 'optician', phonetic: '/ɒpˈtɪʃn/', pos: 'n.',
    meaning: '眼镜商；验光师', hint: '视力/眼 + 专家 → 管眼睛的人',
    segments: [R('opt', '视力、眼'), S('ician', '专家')],
  },

  // ==================== -ator / -or 施动者 ====================
  {
    word: 'spectator', phonetic: '/spekˈteɪtə/', pos: 'n.',
    meaning: '观众；旁观者', hint: '看 + ……的人 → 在一旁看的人',
    segments: [R('spect', '看'), S('ator', '……的人')],
  },
  {
    word: 'inspector', phonetic: '/ɪnˈspektə/', pos: 'n.',
    meaning: '检查员；督察', hint: '向内 + 看 + ……的人 → 深入查看的人',
    segments: [P('in', '向内'), R('spect', '看'), S('or', '……的人')],
  },
  {
    word: 'dictator', phonetic: '/dɪkˈteɪtə/', pos: 'n.',
    meaning: '独裁者', hint: '说/命令 + ……的人 → 说了就算的人',
    segments: [R('dict', '说、命令'), S('ator', '……的人')],
  },
  {
    word: 'predator', phonetic: '/ˈpredətə/', pos: 'n.',
    meaning: '捕食者；掠食者', hint: '掠夺 + ……的人/物 → 靠掠食为生的动物',
    segments: [R('pred', '掠夺'), S('ator', '……的人/物')],
  },
  {
    word: 'aviator', phonetic: '/ˈeɪvieɪtə/', pos: 'n.',
    meaning: '飞行员', hint: '鸟 + ……的人 → 像鸟一样飞的人',
    segments: [R('avi', '鸟'), S('ator', '……的人')],
  },
  {
    word: 'gladiator', phonetic: '/ˈɡlædieɪtə/', pos: 'n.',
    meaning: '角斗士', hint: '剑 + ……的人 → 持剑搏斗的人',
    segments: [R('gladi', '剑'), S('ator', '……的人')],
  },
  {
    word: 'liberator', phonetic: '/ˈlɪbəreɪtə/', pos: 'n.',
    meaning: '解放者', hint: '自由 + ……的人 → 带来自由的人',
    segments: [R('liber', '自由'), S('ator', '……的人')],
  },
  {
    word: 'supervisor', phonetic: '/ˈsuːpəvaɪzə/', pos: 'n.',
    meaning: '主管；监督人', hint: '在上 + 看 + ……的人 → 在上头看着的人',
    segments: [P('super', '在上'), R('vis', '看'), S('or', '……的人')],
  },

  // ==================== -cracy 统治 ====================
  {
    word: 'autocracy', phonetic: '/ɔːˈtɒkrəsi/', pos: 'n.',
    meaning: '独裁；专制', hint: '自己 + 统治 → 一个人说了算',
    segments: [P('auto', '自己'), R('cracy', '统治')],
  },
  {
    word: 'plutocracy', phonetic: '/pluːˈtɒkrəsi/', pos: 'n.',
    meaning: '财阀统治', hint: '财富 + 统治 → 有钱人统治',
    segments: [R('pluto', '财富'), R('cracy', '统治')],
  },
  {
    word: 'theocracy', phonetic: '/θiˈɒkrəsi/', pos: 'n.',
    meaning: '神权政治', hint: '神 + 统治 → 以神的名义统治',
    segments: [R('theo', '神'), R('cracy', '统治')],
  },
  {
    word: 'meritocracy', phonetic: '/ˌmerɪˈtɒkrəsi/', pos: 'n.',
    meaning: '精英/任人唯贤体制', hint: '才能 + 统治 → 凭本事上位',
    segments: [R('merito', '才能、功绩'), R('cracy', '统治')],
  },

  // ==================== -archy 统治 / -archy ====================
  {
    word: 'matriarchy', phonetic: '/ˈmeɪtriɑːki/', pos: 'n.',
    meaning: '母权制', hint: '母亲 + 统治 → 由女性当家',
    segments: [R('matri', '母亲'), R('archy', '统治')],
  },
  {
    word: 'patriarchy', phonetic: '/ˈpeɪtriɑːki/', pos: 'n.',
    meaning: '父权制', hint: '父亲 + 统治 → 由男性当家',
    segments: [R('patri', '父亲'), R('archy', '统治')],
  },

  // ==================== -meter / -metry 测量 ====================
  {
    word: 'diameter', phonetic: '/daɪˈæmɪtə/', pos: 'n.',
    meaning: '直径', hint: '穿过 + 测量 → 穿过圆心量出的长度',
    segments: [P('dia', '穿过'), R('meter', '测量')],
  },
  {
    word: 'perimeter', phonetic: '/pəˈrɪmɪtə/', pos: 'n.',
    meaning: '周长；周界', hint: '周围 + 测量 → 量一圈的长度',
    segments: [P('peri', '周围'), R('meter', '测量')],
  },
  {
    word: 'altimeter', phonetic: '/ˈæltɪmiːtə/', pos: 'n.',
    meaning: '高度计', hint: '高度 + 测量器 → 量高度的仪器',
    segments: [R('alti', '高度'), R('meter', '测量器')],
  },
  {
    word: 'pedometer', phonetic: '/pɪˈdɒmɪtə/', pos: 'n.',
    meaning: '计步器', hint: '脚 +（连接 o）+ 测量器 → 数脚步的仪器',
    segments: [R('ped', '脚'), L('o'), R('meter', '测量器')],
  },
  {
    word: 'geometry', phonetic: '/dʒiˈɒmətri/', pos: 'n.',
    meaning: '几何（学）', hint: '土地 + 测量 → 古人量地发展出的学问',
    segments: [R('geo', '土地'), R('metry', '测量')],
  },
  {
    word: 'symmetry', phonetic: '/ˈsɪmətri/', pos: 'n.',
    meaning: '对称', hint: '相同 + 测量 → 两边量起来一样',
    segments: [P('sym', '相同'), R('metry', '测量')],
  },

  // ==================== -scope 看 ====================
  {
    word: 'periscope', phonetic: '/ˈperɪskəʊp/', pos: 'n.',
    meaning: '潜望镜', hint: '周围 + 看 → 在水下看周围',
    segments: [P('peri', '周围'), R('scope', '看')],
  },
  {
    word: 'stethoscope', phonetic: '/ˈsteθəskəʊp/', pos: 'n.',
    meaning: '听诊器', hint: '胸腔 + 看/察 → 探察胸腔的工具',
    segments: [R('stetho', '胸腔'), R('scope', '看、察')],
  },
  {
    word: 'kaleidoscope', phonetic: '/kəˈlaɪdəskəʊp/', pos: 'n.',
    meaning: '万花筒', hint: '美丽图形 + 看 → 看美丽图形的筒',
    segments: [R('kaleido', '美丽图形'), R('scope', '看')],
  },
  {
    word: 'horoscope', phonetic: '/ˈhɒrəskəʊp/', pos: 'n.',
    meaning: '星座运势；占星', hint: '时辰/星象 + 看 → 看星象推运势',
    segments: [R('horo', '时辰、星象'), R('scope', '看')],
  },

  // ==================== -phone / -phon 声音 ====================
  {
    word: 'telephone', phonetic: '/ˈtelɪfəʊn/', pos: 'n.',
    meaning: '电话', hint: '远 + 声音 → 把声音传到远处',
    segments: [P('tele', '远'), R('phone', '声音')],
  },
  {
    word: 'microphone', phonetic: '/ˈmaɪkrəfəʊn/', pos: 'n.',
    meaning: '麦克风；话筒', hint: '小/放大 + 声音 → 把小声音放大',
    segments: [P('micro', '微小'), R('phone', '声音')],
  },
  {
    word: 'megaphone', phonetic: '/ˈmeɡəfəʊn/', pos: 'n.',
    meaning: '扩音器', hint: '大 + 声音 → 把声音变大',
    segments: [P('mega', '大'), R('phone', '声音')],
  },
  {
    word: 'xylophone', phonetic: '/ˈzaɪləfəʊn/', pos: 'n.',
    meaning: '木琴', hint: '木 + 声音 → 敲木头发声的乐器',
    segments: [R('xylo', '木'), R('phone', '声音')],
  },
  {
    word: 'homophone', phonetic: '/ˈhɒməfəʊn/', pos: 'n.',
    meaning: '同音词', hint: '相同 + 声音 → 读音相同的词',
    segments: [R('homo', '相同'), R('phone', '声音')],
  },
  {
    word: 'symphony', phonetic: '/ˈsɪmfəni/', pos: 'n.',
    meaning: '交响乐', hint: '共同 + 声音 + 名词 → 众多乐器一起发声',
    segments: [P('sym', '共同'), R('phon', '声音'), S('y', '名词')],
  },
  {
    word: 'cacophony', phonetic: '/kəˈkɒfəni/', pos: 'n.',
    meaning: '刺耳的杂音', hint: '坏/刺耳 + 声音 + 名词 → 难听的混乱声音',
    segments: [R('caco', '坏、刺耳'), R('phon', '声音'), S('y', '名词')],
  },

  // ==================== -pathy 感觉/疾病 ====================
  {
    word: 'sympathy', phonetic: '/ˈsɪmpəθi/', pos: 'n.',
    meaning: '同情', hint: '共同 + 感觉 → 与人感同身受',
    segments: [P('sym', '共同'), R('pathy', '感觉')],
  },
  {
    word: 'empathy', phonetic: '/ˈempəθi/', pos: 'n.',
    meaning: '共情；同理心', hint: '进入 + 感觉 → 进入对方的感受',
    segments: [P('em', '进入'), R('pathy', '感觉')],
  },
  {
    word: 'apathy', phonetic: '/ˈæpəθi/', pos: 'n.',
    meaning: '冷漠；无感', hint: '无 + 感觉 → 没有感觉',
    segments: [P('a', '无'), R('pathy', '感觉')],
  },
  {
    word: 'antipathy', phonetic: '/ænˈtɪpəθi/', pos: 'n.',
    meaning: '反感；厌恶', hint: '相反 + 感觉 → 抵触的感觉',
    segments: [P('anti', '相反'), R('pathy', '感觉')],
  },
  {
    word: 'telepathy', phonetic: '/təˈlepəθi/', pos: 'n.',
    meaning: '心灵感应', hint: '远 + 感觉 → 远距离传递感受',
    segments: [P('tele', '远'), R('pathy', '感觉')],
  },

  // ==================== -itis 炎症 ====================
  {
    word: 'arthritis', phonetic: '/ɑːˈθraɪtɪs/', pos: 'n.',
    meaning: '关节炎', hint: '关节 + 炎症 → 关节发炎',
    segments: [R('arthr', '关节'), S('itis', '炎症')],
  },
  {
    word: 'bronchitis', phonetic: '/brɒŋˈkaɪtɪs/', pos: 'n.',
    meaning: '支气管炎', hint: '支气管 + 炎症 → 支气管发炎',
    segments: [R('bronch', '支气管'), S('itis', '炎症')],
  },
  {
    word: 'dermatitis', phonetic: '/ˌdɜːməˈtaɪtɪs/', pos: 'n.',
    meaning: '皮炎', hint: '皮肤 + 炎症 → 皮肤发炎',
    segments: [R('dermat', '皮肤'), S('itis', '炎症')],
  },
  {
    word: 'hepatitis', phonetic: '/ˌhepəˈtaɪtɪs/', pos: 'n.',
    meaning: '肝炎', hint: '肝 + 炎症 → 肝脏发炎',
    segments: [R('hepat', '肝'), S('itis', '炎症')],
  },
  {
    word: 'appendicitis', phonetic: '/əˌpendəˈsaɪtɪs/', pos: 'n.',
    meaning: '阑尾炎', hint: '阑尾 + 炎症 → 阑尾发炎',
    segments: [R('appendic', '阑尾'), S('itis', '炎症')],
  },

  // ==================== -cide 杀 ====================
  {
    word: 'pesticide', phonetic: '/ˈpestɪsaɪd/', pos: 'n.',
    meaning: '杀虫剂；农药', hint: '害虫 +（连接 i）+ 杀 → 杀害虫的药',
    segments: [R('pest', '害虫'), L('i'), R('cide', '杀')],
  },
  {
    word: 'homicide', phonetic: '/ˈhɒmɪsaɪd/', pos: 'n.',
    meaning: '杀人；凶杀', hint: '人 +（连接 i）+ 杀 → 杀人',
    segments: [R('hom', '人'), L('i'), R('cide', '杀')],
  },
  {
    word: 'suicide', phonetic: '/ˈsuːɪsaɪd/', pos: 'n.',
    meaning: '自杀', hint: '自己 +（连接 i）+ 杀 → 杀自己',
    segments: [R('su', '自己'), L('i'), R('cide', '杀')],
  },
  {
    word: 'patricide', phonetic: '/ˈpætrɪsaɪd/', pos: 'n.',
    meaning: '弑父', hint: '父亲 +（连接 i）+ 杀 → 杀父亲',
    segments: [R('patr', '父亲'), L('i'), R('cide', '杀')],
  },
  {
    word: 'bactericide', phonetic: '/bækˈtɪərɪsaɪd/', pos: 'n.',
    meaning: '杀菌剂', hint: '细菌 +（连接 i）+ 杀 → 杀细菌的药',
    segments: [R('bacter', '细菌'), L('i'), R('cide', '杀')],
  },

  // ==================== -naut 航行者 / -nym 名字 ====================
  {
    word: 'cosmonaut', phonetic: '/ˈkɒzmənɔːt/', pos: 'n.',
    meaning: '宇航员', hint: '宇宙 + 航行者 → 在宇宙航行的人',
    segments: [R('cosmo', '宇宙'), R('naut', '航行者')],
  },
  {
    word: 'aquanaut', phonetic: '/ˈækwənɔːt/', pos: 'n.',
    meaning: '水下航行员；潜航员', hint: '水 + 航行者 → 在水下航行的人',
    segments: [R('aqua', '水'), R('naut', '航行者')],
  },
  {
    word: 'homonym', phonetic: '/ˈhɒmənɪm/', pos: 'n.',
    meaning: '同音/同形异义词', hint: '相同 + 名字 → 写法或读音相同的词',
    segments: [R('homo', '相同'), R('nym', '名字')],
  },
  {
    word: 'toponym', phonetic: '/ˈtɒpənɪm/', pos: 'n.',
    meaning: '地名', hint: '地方 + 名字 → 地方的名字',
    segments: [R('topo', '地方'), R('nym', '名字')],
  },

  // ==================== -thesis 放置 / -logue 说话 ====================
  {
    word: 'synthesis', phonetic: '/ˈsɪnθəsɪs/', pos: 'n.',
    meaning: '综合；合成', hint: '共同 + 放置 → 把东西放到一起',
    segments: [P('syn', '共同'), R('thesis', '放置')],
  },
  {
    word: 'parenthesis', phonetic: '/pəˈrenθəsɪs/', pos: 'n.',
    meaning: '圆括号；插入语', hint: '旁边 +（插入 en）+ 放置 → 放在旁边的插入内容',
    segments: [P('par', '旁边'), L('en'), R('thesis', '放置')],
  },
  {
    word: 'catalogue', phonetic: '/ˈkætəlɒɡ/', pos: 'n.',
    meaning: '目录；产品手册', hint: '完全 + 说/列 → 把东西完整列出来',
    segments: [P('cata', '完全、向下'), R('logue', '说、列')],
  },

  // ==================== bio / med / 诊断 ====================
  {
    word: 'antibody', phonetic: '/ˈæntibɒdi/', pos: 'n.',
    meaning: '抗体', hint: '对抗 + 身体 → 身体里对抗病菌的东西',
    segments: [P('anti', '对抗'), R('body', '身体')],
  },
  {
    word: 'antibiotic', phonetic: '/ˌæntibaɪˈɒtɪk/', pos: 'n.',
    meaning: '抗生素', hint: '对抗 + 生命 + 物 → 对抗（细菌）生命的药',
    segments: [P('anti', '对抗'), R('bio', '生命'), S('tic', '……的物')],
  },
  {
    word: 'epidemic', phonetic: '/ˌepɪˈdemɪk/', pos: 'n.',
    meaning: '流行病', hint: '在……中 + 人民 + 名词 → 在人群中蔓延的病',
    segments: [P('epi', '在……中'), R('dem', '人民'), S('ic', '名词')],
  },
  {
    word: 'pandemic', phonetic: '/pænˈdemɪk/', pos: 'n.',
    meaning: '大流行病', hint: '全部 + 人民 + 名词 → 席卷所有人的病',
    segments: [P('pan', '全部'), R('dem', '人民'), S('ic', '名词')],
  },
  {
    word: 'diagnosis', phonetic: '/ˌdaɪəɡˈnəʊsɪs/', pos: 'n.',
    meaning: '诊断', hint: '彻底 + 知道 → 彻底查清病情',
    segments: [P('dia', '彻底、穿过'), R('gnosis', '知道')],
  },
  {
    word: 'prognosis', phonetic: '/prɒɡˈnəʊsɪs/', pos: 'n.',
    meaning: '预后；预测', hint: '预先 + 知道 → 预先判断病情走向',
    segments: [P('pro', '预先'), R('gnosis', '知道')],
  },

  // ==================== -ation / -ion 过程·结果 ====================
  {
    word: 'constellation', phonetic: '/ˌkɒnstəˈleɪʃn/', pos: 'n.',
    meaning: '星座；星群', hint: '共同 + 星 + 名词 → 聚在一起的一群星',
    segments: [P('con', '共同'), R('stell', '星'), S('ation', '名词')],
  },
  {
    word: 'illumination', phonetic: '/ɪˌluːmɪˈneɪʃn/', pos: 'n.',
    meaning: '照明；启发', hint: '使 + 光 + 名词 → 使其发光',
    segments: [P('il', '使'), R('lumin', '光'), S('ation', '名词')],
  },
  {
    word: 'dehydration', phonetic: '/ˌdiːhaɪˈdreɪʃn/', pos: 'n.',
    meaning: '脱水', hint: '去除 + 水 + 名词 → 把水分去掉',
    segments: [P('de', '去除'), R('hydr', '水'), S('ation', '名词')],
  },
  {
    word: 'conservation', phonetic: '/ˌkɒnsəˈveɪʃn/', pos: 'n.',
    meaning: '保护；保存', hint: '共同 + 保持 + 名词 → 一起守住不让流失',
    segments: [P('con', '共同'), R('serv', '保持'), S('ation', '名词')],
  },
  {
    word: 'malnutrition', phonetic: '/ˌmælnjuˈtrɪʃn/', pos: 'n.',
    meaning: '营养不良', hint: '不良 + 营养 + 名词 → 营养出问题',
    segments: [P('mal', '不良、坏'), R('nutr', '营养'), S('ition', '名词')],
  },

  // ==================== bene / mal 善·恶 ====================
  {
    word: 'benediction', phonetic: '/ˌbenɪˈdɪkʃn/', pos: 'n.',
    meaning: '祝福；祝祷', hint: '好 + 说 + 名词 → 说好话祝福',
    segments: [P('bene', '好'), R('dict', '说'), S('ion', '名词')],
  },
  {
    word: 'benevolence', phonetic: '/bəˈnevələns/', pos: 'n.',
    meaning: '仁慈；善意', hint: '好 + 意愿 + 名词 → 怀着好的心意',
    segments: [P('bene', '好'), R('vol', '意愿'), S('ence', '名词')],
  },
  {
    word: 'malevolence', phonetic: '/məˈlevələns/', pos: 'n.',
    meaning: '恶意', hint: '坏 +（连接 e）+ 意愿 + 名词 → 怀着坏心意',
    segments: [P('mal', '坏'), L('e'), R('vol', '意愿'), S('ence', '名词')],
  },

  // ==================== 多 / 全 / 等 ====================
  {
    word: 'monopoly', phonetic: '/məˈnɒpəli/', pos: 'n.',
    meaning: '垄断；专卖', hint: '单一 + 卖 → 独家在卖',
    segments: [P('mono', '单一'), R('poly', '卖')],
  },
  {
    word: 'polygon', phonetic: '/ˈpɒlɪɡɒn/', pos: 'n.',
    meaning: '多边形', hint: '多 + 角 → 有很多角的图形',
    segments: [P('poly', '多'), R('gon', '角')],
  },
  {
    word: 'polyglot', phonetic: '/ˈpɒliɡlɒt/', pos: 'n.',
    meaning: '通晓多种语言者', hint: '多 + 语言/舌 → 会多门语言的人',
    segments: [P('poly', '多'), R('glot', '语言、舌')],
  },
  {
    word: 'equilibrium', phonetic: '/ˌiːkwɪˈlɪbriəm/', pos: 'n.',
    meaning: '平衡', hint: '相等 + 秤/平衡 + 名词 → 两边一样重',
    segments: [P('equi', '相等'), R('libr', '秤、平衡'), S('ium', '名词')],
  },
  {
    word: 'omnipotence', phonetic: '/ɒmˈnɪpətəns/', pos: 'n.',
    meaning: '全能；无所不能', hint: '全部 + 力量 + 名词 → 拥有一切力量',
    segments: [P('omni', '全部'), R('pot', '力量'), S('ence', '名词')],
  },

  // ==================== -itude 状态 ====================
  {
    word: 'gratitude', phonetic: '/ˈɡrætɪtjuːd/', pos: 'n.',
    meaning: '感激；感恩', hint: '感谢 + 状态 → 心怀感谢',
    segments: [R('grat', '感谢'), S('itude', '状态')],
  },
  {
    word: 'solitude', phonetic: '/ˈsɒlɪtjuːd/', pos: 'n.',
    meaning: '独处；孤独', hint: '独自 + 状态 → 一个人的状态',
    segments: [R('sol', '独自'), S('itude', '状态')],
  },
  {
    word: 'magnitude', phonetic: '/ˈmæɡnɪtjuːd/', pos: 'n.',
    meaning: '巨大；震级', hint: '大 + 状态 → 大的程度',
    segments: [R('magn', '大'), S('itude', '状态')],
  },
  {
    word: 'altitude', phonetic: '/ˈæltɪtjuːd/', pos: 'n.',
    meaning: '海拔；高度', hint: '高 + 状态 → 高的程度',
    segments: [R('alt', '高'), S('itude', '状态')],
  },
  {
    word: 'aptitude', phonetic: '/ˈæptɪtjuːd/', pos: 'n.',
    meaning: '天资；才能', hint: '能力/适合 + 状态 → 天生擅长的状态',
    segments: [R('apt', '能力、适合'), S('itude', '状态')],
  },

  // ==================== 其他经典 ====================
  {
    word: 'territory', phonetic: '/ˈterətri/', pos: 'n.',
    meaning: '领土；领域', hint: '土地 + 名词 → 属于某方的土地',
    segments: [R('terr', '土地'), S('itory', '名词')],
  },
  {
    word: 'aquarium', phonetic: '/əˈkweəriəm/', pos: 'n.',
    meaning: '水族馆；鱼缸', hint: '水 + 场所 → 养水生动物的地方',
    segments: [R('aqua', '水'), S('rium', '场所')],
  },
  {
    word: 'chronicle', phonetic: '/ˈkrɒnɪkl/', pos: 'n.',
    meaning: '编年史', hint: '时间 + 名词 → 按时间记录的史书',
    segments: [R('chron', '时间'), S('icle', '名词')],
  },
  {
    word: 'anachronism', phonetic: '/əˈnækrənɪzəm/', pos: 'n.',
    meaning: '时代错误；不合时宜', hint: '逆/错 + 时间 + 名词 → 弄错了时代的东西',
    segments: [P('ana', '逆、错'), R('chron', '时间'), S('ism', '名词')],
  },
  {
    word: 'astrology', phonetic: '/əˈstrɒlədʒi/', pos: 'n.',
    meaning: '占星术', hint: '星 + 学/说 → 凭星象推命运',
    segments: [R('astro', '星'), R('logy', '学、说')],
  },
  {
    word: 'protagonist', phonetic: '/prəˈtæɡənɪst/', pos: 'n.',
    meaning: '主角', hint: '首要 + 角色/争 + ……的人 → 戏里挑大梁的人',
    segments: [R('prot', '首要、第一'), R('agon', '角色、争斗'), S('ist', '……的人')],
  },
  {
    word: 'antagonist', phonetic: '/ænˈtæɡənɪst/', pos: 'n.',
    meaning: '对手；反派', hint: '相反 + 争斗 + ……的人 → 与主角作对的人',
    segments: [P('ant', '相反'), R('agon', '争斗'), S('ist', '……的人')],
  },
  {
    word: 'monotheism', phonetic: '/ˈmɒnəʊθiːɪzəm/', pos: 'n.',
    meaning: '一神论', hint: '单一 + 神 + 主义 → 只信一个神',
    segments: [P('mono', '单一'), R('the', '神'), S('ism', '主义')],
  },
  {
    word: 'polytheism', phonetic: '/ˈpɒliθiːɪzəm/', pos: 'n.',
    meaning: '多神论', hint: '多 + 神 + 主义 → 信奉多个神',
    segments: [P('poly', '多'), R('the', '神'), S('ism', '主义')],
  },
];

/** 把词素类型转成中文标签 */
export const segmentTypeLabel = (type: SegmentType): string =>
  type === 'prefix'
    ? '前缀'
    : type === 'suffix'
    ? '后缀'
    : type === 'link'
    ? '连接'
    : '词根';

export interface RelatedGroup {
  morpheme: string;
  meaning: string;
  words: {word: string; meaning: string}[];
}

/**
 * 同根词（举一反三）：在数据集中找出与目标词共享同一词根/前缀的其他词。
 * 只按 root / prefix 匹配（排除语法后缀和连接字母，避免 -y/-ion 这类无意义的撞车）。
 * 体现"记一个词根，认一串词"的猜词超能力。
 */
export const getRelatedWords = (
  target: GuessWord,
  maxPerGroup = 5,
): RelatedGroup[] => {
  const groups: RelatedGroup[] = [];
  const usedWords = new Set<string>(); // 同一个兄弟词不在多个组里重复出现
  for (const seg of target.segments) {
    if (seg.type !== 'root' && seg.type !== 'prefix') continue;
    if (!seg.meaning) continue;
    const siblings = guessWords.filter(
      w =>
        w.word !== target.word &&
        !usedWords.has(w.word) &&
        w.segments.some(s => s.text === seg.text),
    );
    if (siblings.length === 0) continue;
    const picked = siblings.slice(0, maxPerGroup);
    picked.forEach(w => usedWords.add(w.word));
    groups.push({
      morpheme: seg.text,
      meaning: seg.meaning,
      words: picked.map(w => ({word: w.word, meaning: w.meaning})),
    });
  }
  return groups;
};

/** Fisher-Yates 洗牌，返回新数组，不修改原数组 */
export const shuffleGuessWords = (): GuessWord[] => {
  const arr = [...guessWords];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// === 开发期自检：segments 拼接必须等于完整单词（保证拆解覆盖每个字母）===
if (__DEV__) {
  guessWords.forEach(w => {
    const joined = w.segments.map(s => s.text).join('');
    if (joined !== w.word) {
      // eslint-disable-next-line no-console
      console.warn(
        `[guessWords] 拆解不完整: "${w.word}" 拼接得到 "${joined}"，请检查 segments`,
      );
    }
  });
}
