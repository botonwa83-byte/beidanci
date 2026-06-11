import {Question} from './types';
import {getWordOrigin} from './wordDatabase';

// ==================== 猜来历题型（词源宇宙·流行性引擎） ====================
// 词源故事选择题："salary 跟哪种物品有关？盐/黄金/羊毛/谷物"。
// 答错也开心——因为揭晓的答案是个故事（explanation 直接取 wordOrigins 的身世文案）。
// choices[0] 恒为正确答案，出题时再洗牌。

interface OriginQuizItem {
  word: string;
  meaning: string;
  prompt: string;
  choices: [string, string, string, string];
}

export const ORIGIN_QUIZ_ITEMS: OriginQuizItem[] = [
  {word: 'salary', meaning: '薪水', prompt: '的词源跟哪种物品有关？', choices: ['盐', '黄金', '羊毛', '谷物']},
  {word: 'muscle', meaning: '肌肉', prompt: '在拉丁语里本指哪种动物？', choices: ['小老鼠', '小牛', '壁虎', '螃蟹']},
  {word: 'window', meaning: '窗户', prompt: '在古北欧语里的字面义是？', choices: ['风之眼', '光之门', '墙之洞', '屋之口']},
  {word: 'companion', meaning: '同伴', prompt: '本义是一起分什么的人？', choices: ['面包', '盐', '酒', '路费']},
  {word: 'candidate', meaning: '候选人', prompt: '因罗马竞选人的什么得名？', choices: ['白袍', '紫袍', '桂冠', '金戒指']},
  {word: 'alarm', meaning: '警报', prompt: '本是战场上的哪句喊话？', choices: ['拿起武器！', '着火了！', '敌人来了！', '快撤退！']},
  {word: 'robot', meaning: '机器人', prompt: '来自哪种语言的「苦役」？', choices: ['捷克语', '俄语', '德语', '拉丁语']},
  {word: 'tea', meaning: '茶', prompt: '的发音来自哪种中国方言？', choices: ['闽南语', '粤语', '吴语', '客家话']},
  {word: 'orange', meaning: '橙子', prompt: '开头的 n 哪去了？', choices: ['a norange 被错切成 an orange', '法语冠词吞掉了', '拉丁词尾脱落了', '印刷工漏排了']},
  {word: 'chocolate', meaning: '巧克力', prompt: '在阿兹特克语里的本义是？', choices: ['苦水', '甜浆', '神的食物', '黑豆子']},
  {word: 'hurricane', meaning: '飓风', prompt: '来自哪位神？', choices: ['加勒比风暴之神', '希腊海神', '北欧雷神', '玛雅雨神']},
  {word: 'vodka', meaning: '伏特加', prompt: '在俄语里的字面义是？', choices: ['小水', '烈火', '生命之水', '雪原']},
  {word: 'bank', meaning: '银行', prompt: '本是什么家具？', choices: ['长凳', '柜子', '账桌', '保险箱']},
  {word: 'bankrupt', meaning: '破产', prompt: '的字面义是？', choices: ['砸烂的长凳', '空掉的金库', '烧掉的账本', '断裂的天平']},
  {word: 'boycott', meaning: '抵制', prompt: '来自什么？', choices: ['一个被全村孤立的人名', '一座爱尔兰小镇', '一部法律', '一艘商船']},
  {word: 'mentor', meaning: '导师', prompt: '出自哪部作品？', choices: ['《奥德赛》', '《伊利亚特》', '《圣经》', '《理想国》']},
  {word: 'echo', meaning: '回声', prompt: '：仙女厄科受了什么惩罚？', choices: ['只能重复别人的话', '永远失去声音', '变成石头', '永远沉睡']},
  {word: 'panic', meaning: '恐慌', prompt: '源自哪位神？', choices: ['牧神潘', '战神阿瑞斯', '冥王哈迪斯', '夜神尼克斯']},
  {word: 'volcano', meaning: '火山', prompt: '下面住着谁？', choices: ['罗马火神的铁匠铺', '宙斯的牢狱', '巨人的厨房', '地狱的入口']},
  {word: 'marathon', meaning: '马拉松', prompt: '纪念的是什么？', choices: ['报捷长跑力竭而死的传令兵', '波斯王的驿道', '雅典的祭典', '斯巴达的行军']},
  {word: 'trivial', meaning: '琐碎的', prompt: '的字面义是？', choices: ['三岔路口（闲聊之地）', '小石子', '碎布头', '尘埃']},
  {word: 'rival', meaning: '对手', prompt: '本义是共用什么的人？', choices: ['同一条河的水', '同一块土地', '同一个集市', '同一匹马']},
  {word: 'pencil', meaning: '铅笔', prompt: '在拉丁语里的本义是？', choices: ['小尾巴/小毛刷', '小石墨', '小木棍', '小刻刀']},
  {word: 'calculate', meaning: '计算', prompt: '：罗马人用什么计数？', choices: ['小石子', '绳结', '算筹', '贝壳']},
  {word: 'money', meaning: '钱', prompt: '跟哪位罗马神祇有关？', choices: ['朱诺（铸币厂设在她神庙）', '墨丘利', '维纳斯', '萨图恩']},
  {word: 'vaccine', meaning: '疫苗', prompt: '的词根是哪种动物？', choices: ['牛', '马', '羊', '猴']},
  {word: 'typhoon', meaning: '台风', prompt: '的西方源头是？', choices: ['希腊风暴巨人 Typhon', '罗马风神', '北欧冰霜巨人', '埃及沙暴神']},
  {word: 'sandwich', meaning: '三明治', prompt: '：伯爵为什么发明它？', choices: ['不愿离开赌桌吃饭', '行军路上没餐具', '航海时省粮食', '宴会上摆阔']},
  {word: 'shampoo', meaning: '洗发水', prompt: '在印地语里的本义是？', choices: ['按摩', '泡沫', '清洗', '香料']},
  {word: 'magazine', meaning: '杂志', prompt: '在阿拉伯语里的本义是？', choices: ['仓库', '集市', '书房', '灯塔']},
  {word: 'alcohol', meaning: '酒精', prompt: '：阿拉伯语 al-kuhl 本指什么？', choices: ['眼影粉', '烈酒', '药水', '香水']},
  {word: 'check', meaning: '将军（象棋）', prompt: '：波斯语 shah 是什么意思？', choices: ['王', '将军', '战车', '城堡']},
  {word: 'umbrella', meaning: '伞', prompt: '的字面义是？', choices: ['小影子', '小帐篷', '挡雨布', '华盖']},
  {word: 'enthusiasm', meaning: '热情', prompt: '的希腊语字面义是？', choices: ['神在体内', '火在胸中', '血在沸腾', '光在眼里']},
  {word: 'astonish', meaning: '使惊讶', prompt: '的拉丁语字面义是？', choices: ['被雷劈到', '被石化', '被闪光晃到', '被吓跑']},
  {word: 'arena', meaning: '竞技场', prompt: '在拉丁语里的本义是？', choices: ['沙子', '圆圈', '斗兽', '呐喊']},
  {word: 'plagiarism', meaning: '抄袭', prompt: '：拉丁语本指哪种贼？', choices: ['拐卖人口的贼', '偷书的贼', '盗墓的贼', '偷马的贼']},
  {word: 'pedagogy', meaning: '教育学', prompt: '：pedagogue 本指什么人？', choices: ['牵孩子上学的奴隶', '私塾先生', '神庙祭司', '宫廷乐师']},
  {word: 'veto', meaning: '否决权', prompt: '的拉丁语字面义是？', choices: ['我禁止', '我怀疑', '我离开', '我抗议']},
  {word: 'budget', meaning: '预算', prompt: '的本义是？', choices: ['小钱袋', '厚账本', '金库', '税单']},
  {word: 'bribery', meaning: '贿赂', prompt: '：bribe 最早指什么？', choices: ['给乞丐的面包块', '塞进袖子的银币', '送官员的酒', '买路钱']},
  {word: 'boulevard', meaning: '林荫大道', prompt: '是什么改建的？', choices: ['城墙堡垒', '旧河道', '跑马场', '老集市']},
  {word: 'denim', meaning: '牛仔布', prompt: '的名字来自？', choices: ['法国尼姆城', '美国丹佛', '一位水手', '一位矿工']},
  {word: 'jeans', meaning: '牛仔裤', prompt: '的名字来自哪座城？', choices: ['意大利热那亚', '法国巴黎', '美国旧金山', '西班牙塞维利亚']},
  {word: 'quarantine', meaning: '隔离', prompt: '本指多少天？', choices: ['40 天', '7 天', '14 天', '30 天']},
  {word: 'disaster', meaning: '灾难', prompt: '的字面义是？', choices: ['星位不正', '天塌地陷', '神的愤怒', '黑色之日']},
  {word: 'goodbye', meaning: '再见', prompt: '是哪句话缩成的？', choices: ['God be with ye', 'Good day to ye', 'Go by easy', 'Good bless ye']},
  {word: 'nickname', meaning: '绰号', prompt: '：an ekename 本义是？', choices: ['附加名', '小名', '假名', '战名']},
];

const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

/** 把一道猜来历题转成复习流 Question；故事直接取 wordOrigins 身世文案 */
export const buildOriginQuizQuestion = (id: number): Question => {
  const item =
    ORIGIN_QUIZ_ITEMS[Math.floor(Math.random() * ORIGIN_QUIZ_ITEMS.length)];
  const story = getWordOrigin(item.word);
  return {
    id,
    type: 'origin-quiz',
    question: `${item.word}（${item.meaning}）${item.prompt}`,
    options: shuffle(
      item.choices.map((text, i) => ({text, isCorrect: i === 0})),
    ),
    explanation: story || item.choices[0],
    level: 1,
  };
};
