export interface GrammarRule {
  id: string;
  category: 'morphology' | 'syntax' | 'usage';
  level: 1 | 2 | 3;
  title: string;
  summary: string;
  color: string;
  rules: {
    pattern: string;
    description: string;
    examples: string[];
  }[];
  relatedSuffixes?: string[];
  tips?: string;
}

export const grammarRules: GrammarRule[] = [
  // ==================== L1 词形变化 ====================
  {
    id: 'g01',
    category: 'morphology',
    level: 1,
    title: '名词复数规则',
    summary: '大多数名词加 -s，特殊情况加 -es/-ies',
    color: '#5B9BD5',
    rules: [
      {
        pattern: '+ s',
        description: '一般名词直接加 -s',
        examples: ['book -> books', 'port -> ports', 'root -> roots'],
      },
      {
        pattern: '-s/-sh/-ch/-x + es',
        description: '以 s/sh/ch/x 结尾的加 -es',
        examples: ['class -> classes', 'match -> matches', 'box -> boxes'],
      },
      {
        pattern: '辅音+y -> ies',
        description: '辅音字母 + y 结尾，变 y 为 i 加 -es',
        examples: [
          'study -> studies',
          'factory -> factories',
          'country -> countries',
        ],
      },
      {
        pattern: '-f/-fe -> ves',
        description: '部分以 f/fe 结尾的名词变 ves',
        examples: ['life -> lives', 'knife -> knives', 'leaf -> leaves'],
      },
    ],
    tips: '不规则复数需要单独记忆：man->men, child->children, mouse->mice',
  },
  {
    id: 'g02',
    category: 'morphology',
    level: 1,
    title: '动词第三人称单数',
    summary: '主语为 he/she/it 时，动词变化规则与名词复数类似',
    color: '#4F6EF7',
    rules: [
      {
        pattern: '+ s',
        description: '一般动词加 -s',
        examples: [
          'work -> works',
          'transport -> transports',
          'export -> exports',
        ],
      },
      {
        pattern: '-s/-sh/-ch/-x/-o + es',
        description: '以 s/sh/ch/x/o 结尾加 -es',
        examples: ['go -> goes', 'teach -> teaches', 'pass -> passes'],
      },
      {
        pattern: '辅音+y -> ies',
        description: '辅音 + y 结尾，变 y 为 i 加 -es',
        examples: ['study -> studies', 'carry -> carries', 'apply -> applies'],
      },
    ],
    tips: 'have 的第三人称单数是 has，be 的是 is',
  },
  {
    id: 'g03',
    category: 'morphology',
    level: 1,
    title: '动词过去式 -ed',
    summary: '规则动词加 -ed 构成过去式和过去分词',
    color: '#2DC89B',
    rules: [
      {
        pattern: '+ ed',
        description: '一般动词直接加 -ed',
        examples: [
          'export -> exported',
          'transport -> transported',
          'report -> reported',
        ],
      },
      {
        pattern: '-e + d',
        description: '以 e 结尾只加 -d',
        examples: [
          'describe -> described',
          'produce -> produced',
          'reduce -> reduced',
        ],
      },
      {
        pattern: '辅音+y -> ied',
        description: '辅音 + y 结尾，变 y 为 i 加 -ed',
        examples: [
          'study -> studied',
          'magnify -> magnified',
          'apply -> applied',
        ],
      },
      {
        pattern: '重读闭音节双写',
        description: '重读闭音节结尾，双写末尾辅音字母再加 -ed',
        examples: [
          'stop -> stopped',
          'admit -> admitted',
          'prefer -> preferred',
        ],
      },
    ],
    tips: '不规则动词（go->went, write->wrote）需要专门记忆',
  },
  {
    id: 'g04',
    category: 'morphology',
    level: 1,
    title: '现在分词 -ing',
    summary: '动词加 -ing 构成进行时和动名词',
    color: '#F472A8',
    rules: [
      {
        pattern: '+ ing',
        description: '一般动词直接加 -ing',
        examples: [
          'export -> exporting',
          'transport -> transporting',
          'report -> reporting',
        ],
      },
      {
        pattern: '-e 去 e + ing',
        description: '以不发音 e 结尾，去 e 加 -ing',
        examples: [
          'describe -> describing',
          'produce -> producing',
          'reduce -> reducing',
        ],
      },
      {
        pattern: '重读闭音节双写',
        description: '重读闭音节结尾，双写末尾辅音字母再加 -ing',
        examples: [
          'run -> running',
          'admit -> admitting',
          'begin -> beginning',
        ],
      },
      {
        pattern: '-ie -> ying',
        description: '以 ie 结尾，变 ie 为 y 再加 -ing',
        examples: ['die -> dying', 'lie -> lying', 'tie -> tying'],
      },
    ],
  },
  {
    id: 'g05',
    category: 'morphology',
    level: 1,
    title: '形容词比较级与最高级',
    summary: '短词加 -er/-est，长词用 more/most',
    color: '#E8A54B',
    rules: [
      {
        pattern: '单音节 + er/est',
        description: '一般单音节形容词加 -er/-est',
        examples: ['tall -> taller -> tallest', 'fast -> faster -> fastest'],
      },
      {
        pattern: '-e + r/st',
        description: '以 e 结尾只加 -r/-st',
        examples: ['large -> larger -> largest', 'nice -> nicer -> nicest'],
      },
      {
        pattern: '多音节 more/most',
        description: '两个音节以上用 more/most',
        examples: [
          'important -> more important',
          'incredible -> most incredible',
        ],
      },
    ],
    tips: '不规则：good->better->best, bad->worse->worst, many/much->more->most',
  },
  {
    id: 'g06',
    category: 'morphology',
    level: 1,
    title: '词性转换：名词化后缀',
    summary: '通过后缀把动词/形容词变为名词',
    color: '#C57BDB',
    relatedSuffixes: ['-tion/-sion', '-ment', '-ness', '-ity'],
    rules: [
      {
        pattern: '-tion / -sion',
        description: '动词 -> 名词，表示动作或状态',
        examples: [
          'transport -> transportation',
          'describe -> description',
          'admit -> admission',
        ],
      },
      {
        pattern: '-ment',
        description: '动词 -> 名词，表示行为或结果',
        examples: [
          'develop -> development',
          'achieve -> achievement',
          'manage -> management',
        ],
      },
      {
        pattern: '-ness',
        description: '形容词 -> 名词，表示性质或状态',
        examples: [
          'happy -> happiness',
          'kind -> kindness',
          'dark -> darkness',
        ],
      },
      {
        pattern: '-ity / -ty',
        description: '形容词 -> 名词，表示性质',
        examples: [
          'possible -> possibility',
          'creative -> creativity',
          'able -> ability',
        ],
      },
    ],
  },
  {
    id: 'g07',
    category: 'morphology',
    level: 1,
    title: '词性转换：形容词化后缀',
    summary: '通过后缀把名词/动词变为形容词',
    color: '#4BC6B0',
    relatedSuffixes: ['-able/-ible', '-ful', '-less', '-ous/-ious'],
    rules: [
      {
        pattern: '-able / -ible',
        description: '表示"可以...的"',
        examples: [
          'transport -> transportable',
          'credit -> credible',
          'access -> accessible',
        ],
      },
      {
        pattern: '-ful',
        description: '表示"充满...的"',
        examples: [
          'hope -> hopeful',
          'power -> powerful',
          'beauty -> beautiful',
        ],
      },
      {
        pattern: '-less',
        description: '表示"没有...的"（与 -ful 相反）',
        examples: [
          'hope -> hopeless',
          'power -> powerless',
          'care -> careless',
        ],
      },
      {
        pattern: '-ous / -ious',
        description: '表示"具有...性质的"',
        examples: [
          'danger -> dangerous',
          'fame -> famous',
          'space -> spacious',
        ],
      },
    ],
  },
  {
    id: 'g08',
    category: 'morphology',
    level: 1,
    title: '词性转换：副词化后缀 -ly',
    summary: '形容词 + ly 变为副词，表示方式',
    color: '#6BBF6B',
    relatedSuffixes: ['-ly'],
    rules: [
      {
        pattern: '+ ly',
        description: '一般直接加 -ly',
        examples: [
          'quick -> quickly',
          'incredible -> incredibly',
          'final -> finally',
        ],
      },
      {
        pattern: '-y -> ily',
        description: '以 y 结尾，变 y 为 i 加 -ly',
        examples: ['happy -> happily', 'easy -> easily', 'heavy -> heavily'],
      },
      {
        pattern: '-le -> ly',
        description: '以 le 结尾，去 e 加 -y',
        examples: [
          'simple -> simply',
          'possible -> possibly',
          'terrible -> terribly',
        ],
      },
    ],
    tips: '有些 -ly 词是形容词而非副词：friendly, lovely, lonely, likely',
  },

  // ==================== L2 句法结构 ====================
  {
    id: 'g09',
    category: 'syntax',
    level: 2,
    title: '五大基本句型',
    summary: '英语句子的五种基本结构',
    color: '#5B9BD5',
    rules: [
      {
        pattern: 'S + V',
        description: '主语 + 不及物动词',
        examples: ['He runs.', 'The sun rises.', 'Time flies.'],
      },
      {
        pattern: 'S + V + O',
        description: '主语 + 及物动词 + 宾语',
        examples: [
          'I study English.',
          'She exports products.',
          'They transport goods.',
        ],
      },
      {
        pattern: 'S + V + C',
        description: '主语 + 系动词 + 表语',
        examples: [
          'He is a student.',
          'The story sounds incredible.',
          'She became famous.',
        ],
      },
      {
        pattern: 'S + V + O + O',
        description: '主语 + 动词 + 间接宾语 + 直接宾语',
        examples: [
          'He gave me a book.',
          'She taught us English.',
          'I told him the truth.',
        ],
      },
      {
        pattern: 'S + V + O + C',
        description: '主语 + 动词 + 宾语 + 宾补',
        examples: [
          'We call him Tom.',
          'The news made her happy.',
          'I found it incredible.',
        ],
      },
    ],
  },
  {
    id: 'g10',
    category: 'syntax',
    level: 2,
    title: '时态体系',
    summary: '英语 12 种时态的构成与用法',
    color: '#4F6EF7',
    rules: [
      {
        pattern: '一般现在时',
        description: 'do/does — 习惯、事实、规律',
        examples: [
          'I study every day.',
          'Water boils at 100°C.',
          'She works in transport.',
        ],
      },
      {
        pattern: '一般过去时',
        description: 'did — 过去的动作或状态',
        examples: [
          'I studied yesterday.',
          'He exported goods last year.',
          'They reported the news.',
        ],
      },
      {
        pattern: '现在进行时',
        description: 'am/is/are + doing — 正在进行',
        examples: [
          'I am studying.',
          'She is describing the scene.',
          'They are transporting cargo.',
        ],
      },
      {
        pattern: '现在完成时',
        description: 'have/has + done — 已完成，与现在有关',
        examples: [
          'I have studied for two hours.',
          'She has described it.',
          'They have exported many products.',
        ],
      },
      {
        pattern: '过去完成时',
        description: 'had + done — 过去的过去',
        examples: [
          'I had studied before the test.',
          'He had already exported the goods when I called.',
        ],
      },
      {
        pattern: '将来时',
        description: 'will + do / be going to + do — 将要发生',
        examples: [
          'I will study tomorrow.',
          'She is going to describe the plan.',
        ],
      },
    ],
    tips: '完成进行时（have been doing）表示从过去开始持续到现在的动作',
  },
  {
    id: 'g11',
    category: 'syntax',
    level: 2,
    title: '被动语态',
    summary: 'be + 过去分词，强调动作的承受者',
    color: '#2DC89B',
    rules: [
      {
        pattern: 'am/is/are + done',
        description: '一般现在时被动',
        examples: [
          'English is spoken worldwide.',
          'Goods are transported by ship.',
        ],
      },
      {
        pattern: 'was/were + done',
        description: '一般过去时被动',
        examples: [
          'The report was written yesterday.',
          'The goods were exported last month.',
        ],
      },
      {
        pattern: 'have/has been + done',
        description: '现在完成时被动',
        examples: [
          'The problem has been described.',
          'Many products have been exported.',
        ],
      },
      {
        pattern: 'will be + done',
        description: '将来时被动',
        examples: [
          'The news will be reported tomorrow.',
          'The goods will be transported next week.',
        ],
      },
    ],
    tips: '不是所有动词都能用被动语态，不及物动词（happen, appear）没有被动形式',
  },
  {
    id: 'g12',
    category: 'syntax',
    level: 2,
    title: '定语从句',
    summary: '用 who/which/that 等引导的从句修饰名词',
    color: '#F472A8',
    rules: [
      {
        pattern: 'who / that',
        description: '修饰人',
        examples: [
          'The man who reported the news is my friend.',
          'Students that study hard will succeed.',
        ],
      },
      {
        pattern: 'which / that',
        description: '修饰物',
        examples: [
          'The book which describes the history is famous.',
          'The goods that were exported are valuable.',
        ],
      },
      {
        pattern: 'whose',
        description: '表示"...的"（所有格）',
        examples: [
          'The student whose score is highest wins.',
          'The company whose products are exported globally.',
        ],
      },
      {
        pattern: 'where / when / why',
        description: '修饰地点、时间、原因',
        examples: [
          'The place where I study is quiet.',
          'The day when he arrived was rainy.',
        ],
      },
    ],
    tips: '限制性从句不加逗号，非限制性从句前加逗号且不能用 that',
  },
  {
    id: 'g13',
    category: 'syntax',
    level: 2,
    title: '条件句（If 句型）',
    summary: '表示假设、条件的三种类型',
    color: '#E8A54B',
    rules: [
      {
        pattern: '零条件句',
        description: 'If + 一般现在, 一般现在 — 客观事实',
        examples: [
          'If you heat water, it boils.',
          'If you study hard, you improve.',
        ],
      },
      {
        pattern: '第一条件句',
        description: 'If + 一般现在, will + do — 真实可能',
        examples: [
          'If it rains, I will stay home.',
          'If you study, you will pass.',
        ],
      },
      {
        pattern: '第二条件句',
        description: 'If + 过去式, would + do — 与现在事实相反的假设',
        examples: [
          'If I had time, I would study more.',
          'If she were here, she would help.',
        ],
      },
      {
        pattern: '第三条件句',
        description: 'If + had done, would have done — 与过去事实相反的假设',
        examples: [
          'If I had studied harder, I would have passed.',
          'If he had reported earlier, we would have known.',
        ],
      },
    ],
  },
  {
    id: 'g14',
    category: 'syntax',
    level: 2,
    title: '常用介词搭配',
    summary: '动词/形容词与介词的固定搭配',
    color: '#C57BDB',
    rules: [
      {
        pattern: '动词 + to',
        description: 'refer to, contribute to, subscribe to, apply to',
        examples: [
          'This refers to the report.',
          'He contributed to the project.',
          'Please apply to the office.',
        ],
      },
      {
        pattern: '动词 + for',
        description: 'apply for, account for, search for, stand for',
        examples: [
          'She applied for the job.',
          'This accounts for 50%.',
          'I searched for the word.',
        ],
      },
      {
        pattern: '动词 + with',
        description: 'deal with, agree with, provide...with',
        examples: [
          'We deal with problems.',
          'I agree with you.',
          'He provided us with information.',
        ],
      },
      {
        pattern: '形容词 + of/about/at',
        description: 'afraid of, aware of, worried about, good at',
        examples: [
          'She is afraid of failure.',
          'He is aware of the risk.',
          'I am good at English.',
        ],
      },
    ],
  },
  {
    id: 'g15',
    category: 'syntax',
    level: 2,
    title: '非谓语动词',
    summary: 'to do / doing / done 三种非谓语形式',
    color: '#4BC6B0',
    rules: [
      {
        pattern: 'to do (不定式)',
        description: '表示目的、将来、具体动作',
        examples: [
          'I want to study English.',
          'She decided to export.',
          'To describe is to make clear.',
        ],
      },
      {
        pattern: 'doing (动名词/现在分词)',
        description: '表示正在进行、习惯性、一般性动作',
        examples: [
          'I enjoy studying.',
          'Transporting goods is his job.',
          'She kept describing the scene.',
        ],
      },
      {
        pattern: 'done (过去分词)',
        description: '表示被动、完成',
        examples: [
          'The exported goods are valuable.',
          'Described in detail, the plan looks great.',
        ],
      },
    ],
    tips: 'remember to do (记得要做) vs remember doing (记得做过了)',
  },

  // ==================== L3 用法辨析 ====================
  {
    id: 'g16',
    category: 'usage',
    level: 3,
    title: 'affect vs effect',
    summary: 'affect 是动词"影响"，effect 是名词"效果"',
    color: '#5B9BD5',
    rules: [
      {
        pattern: 'affect (v.)',
        description: '动词，表示"影响、感动"',
        examples: [
          'The weather affects my mood.',
          'Pollution affects our health.',
        ],
      },
      {
        pattern: 'effect (n.)',
        description: '名词，表示"效果、影响"',
        examples: [
          'The effect of the medicine is obvious.',
          'This has a positive effect on learning.',
        ],
      },
    ],
    tips: '记忆：Affect 是 Action（动作/动词），Effect 是 End result（结果/名词）',
  },
  {
    id: 'g17',
    category: 'usage',
    level: 3,
    title: 'rise vs raise',
    summary: 'rise 不及物"升起"，raise 及物"举起、提高"',
    color: '#4F6EF7',
    rules: [
      {
        pattern: 'rise (vi.)',
        description: '不及物动词，自己上升（rise-rose-risen）',
        examples: [
          'The sun rises in the east.',
          'Prices rise every year.',
          'He rose from his seat.',
        ],
      },
      {
        pattern: 'raise (vt.)',
        description: '及物动词，使...上升（raise-raised-raised）',
        examples: [
          'Please raise your hand.',
          'They raised the price.',
          'She raised three children.',
        ],
      },
    ],
  },
  {
    id: 'g18',
    category: 'usage',
    level: 3,
    title: 'much / many / a lot of',
    summary: '不可数用 much，可数用 many，a lot of 通用',
    color: '#2DC89B',
    rules: [
      {
        pattern: 'much + 不可数',
        description: '修饰不可数名词，多用于否定句和疑问句',
        examples: ["I don't have much time.", 'How much water do you need?'],
      },
      {
        pattern: 'many + 可数复数',
        description: '修饰可数名词复数',
        examples: [
          'There are many students.',
          'How many words have you learned?',
        ],
      },
      {
        pattern: 'a lot of / lots of',
        description: '可数不可数均可，多用于肯定句',
        examples: ['I have a lot of books.', 'She has a lot of experience.'],
      },
    ],
  },
  {
    id: 'g19',
    category: 'usage',
    level: 3,
    title: 'since vs for',
    summary: 'since + 时间点，for + 时间段',
    color: '#F472A8',
    rules: [
      {
        pattern: 'since + 时间点',
        description: '从某个时间点开始，常与完成时连用',
        examples: [
          'I have studied English since 2020.',
          'She has worked here since May.',
        ],
      },
      {
        pattern: 'for + 时间段',
        description: '持续了多长时间',
        examples: [
          'I have studied for three years.',
          'She has worked here for six months.',
        ],
      },
    ],
    tips: 'since 后面接的是过去的某个点，for 后面接的是一段时间长度',
  },
  {
    id: 'g20',
    category: 'usage',
    level: 3,
    title: 'used to / be used to / get used to',
    summary: '三个含 used 的短语，含义完全不同',
    color: '#E8A54B',
    rules: [
      {
        pattern: 'used to + do',
        description: '过去常常做（现在不做了）',
        examples: ['I used to study at night.', 'She used to live in Beijing.'],
      },
      {
        pattern: 'be used to + doing',
        description: '习惯于做某事',
        examples: [
          'I am used to studying early.',
          'He is used to working hard.',
        ],
      },
      {
        pattern: 'be used to + do',
        description: '被用来做某事（被动）',
        examples: [
          'This tool is used to measure length.',
          'Computers are used to process data.',
        ],
      },
    ],
  },
  {
    id: 'g21',
    category: 'usage',
    level: 3,
    title: 'some / any',
    summary: 'some 用于肯定句，any 用于否定句和疑问句',
    color: '#C57BDB',
    rules: [
      {
        pattern: 'some',
        description: '用于肯定句，或期望得到肯定回答的疑问句',
        examples: [
          'I have some books.',
          'Would you like some tea?',
          'There are some students outside.',
        ],
      },
      {
        pattern: 'any',
        description: '用于否定句和一般疑问句',
        examples: [
          "I don't have any money.",
          'Do you have any questions?',
          'Is there any problem?',
        ],
      },
    ],
    tips: 'any 用于肯定句时表示"任何"：Any student can answer this question.',
  },
  {
    id: 'g22',
    category: 'usage',
    level: 3,
    title: 'look / see / watch',
    summary: '三个"看"的区别：主动看/看见/观看',
    color: '#4BC6B0',
    rules: [
      {
        pattern: 'look (at)',
        description: '主动看，强调看的动作',
        examples: ['Look at the blackboard.', 'She looked at me and smiled.'],
      },
      {
        pattern: 'see',
        description: '看见，强调看的结果',
        examples: [
          'I can see the mountain.',
          'Did you see that?',
          'I saw him yesterday.',
        ],
      },
      {
        pattern: 'watch',
        description: '观看（移动的事物），注视',
        examples: [
          'I watch TV every evening.',
          'Watch the game carefully.',
          'He watched the sunset.',
        ],
      },
    ],
  },
  {
    id: 'g23',
    category: 'usage',
    level: 3,
    title: 'in / on / at（时间）',
    summary: '大时间用 in，具体日期用 on，时刻用 at',
    color: '#6BBF6B',
    rules: [
      {
        pattern: 'in + 大时间',
        description: '年/月/季节/世纪/上下午',
        examples: ['in 2025', 'in May', 'in summer', 'in the morning'],
      },
      {
        pattern: 'on + 具体日期',
        description: '某天/星期/特定日期',
        examples: [
          'on Monday',
          'on May 1st',
          'on my birthday',
          'on a cold morning',
        ],
      },
      {
        pattern: 'at + 时刻',
        description: '几点/夜晚/节日时刻',
        examples: ['at 8:00', 'at night', 'at noon', 'at Christmas'],
      },
    ],
  },
];

// 按分类分组
export const grammarCategories = [
  {key: 'morphology' as const, label: '词形变化', color: '#5B9BD5'},
  {key: 'syntax' as const, label: '句法结构', color: '#4F6EF7'},
  {key: 'usage' as const, label: '用法辨析', color: '#2DC89B'},
];

export const getGrammarByCategory = (category: GrammarRule['category']) =>
  grammarRules.filter(r => r.category === category);

export const getGrammarByLevel = (level: 1 | 2 | 3) =>
  grammarRules.filter(r => r.level === level);
