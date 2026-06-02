#!/usr/bin/env python3
"""
Expand word database by:
1. Adding new etymological roots with words from supplement
2. Moving supplement words that belong to existing roots
3. Keeping remaining supplement words as-is
"""
import json
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
RAW_PATH = os.path.join(DATA_DIR, 'wordDatabaseRaw.json')

with open(RAW_PATH, 'r') as f:
    db = json.load(f)

roots = db['roots']
supplement = db['supplement']

# Collect all supplement words into a flat list
all_supp = {}
for cat, words in supplement.items():
    for w in words:
        all_supp[w['word'].lower()] = {'word': w['word'], 'pos': w['pos'], 'meaning': w['meaning'], 'cat': cat}

# Existing root word sets
existing_root_words = set()
for r in roots:
    for w in r['words']:
        existing_root_words.add(w['word'].lower())

# Track which supplement words get assigned
assigned = set()

# === New roots to add ===
# Each: (id, root, meaning, origin, color, level, words_list)
# words_list: list of (word, pos, meaning) from supplement or new
new_roots_data = [
    ('sta', 'sta/stat', '站立/状态', '拉丁语 stare', '#E67E22', 3, [
        ('state', 'n', '状态；国家'),
        ('status', 'n', '地位；状态'),
        ('stable', 'a', '稳定的'),
        ('station', 'n', '车站；站'),
        ('statue', 'n', '雕像'),
        ('stage', 'n', '阶段；舞台'),
        ('establish', 'v', '建立'),
        ('standard', 'n', '标准'),
        ('instance', 'n', '实例'),
        ('instant', 'a', '立即的'),
        ('obstacle', 'n', '障碍'),
        ('circumstance', 'n', '情况'),
        ('substance', 'n', '物质'),
        ('substitute', 'v', '替代'),
        ('contrast', 'n', '对比'),
        ('constant', 'a', '持续的'),
        ('distant', 'a', '遥远的'),
        ('static', 'a', '静态的'),
        ('statistics', 'n', '统计学'),
        ('estate', 'n', '房产；庄园'),
    ]),
    ('duc', 'duc/duce', '引导/领导', '拉丁语 ducere', '#8E44AD', 3, [
        ('produce', 'v', '生产'),
        ('reduce', 'v', '减少'),
        ('introduce', 'v', '介绍'),
        ('educate', 'v', '教育'),
        ('education', 'n', '教育'),
        ('seduce', 'v', '引诱'),
        ('induce', 'v', '引起；诱导'),
        ('deduce', 'v', '推断'),
    ]),
    ('vid', 'vid/view', '看/视', '拉丁语 videre', '#1ABC9C', 4, [
        ('video', 'n', '视频'),
        ('view', 'n', '视野；观点'),
        ('review', 'v', '复习；评论'),
        ('interview', 'n', '面试；采访'),
        ('overview', 'n', '概述'),
        ('preview', 'n', '预览'),
        ('evidence', 'n', '证据'),
        ('evident', 'a', '明显的'),
        ('provide', 'v', '提供'),
        ('provision', 'n', '供应；条款'),
        ('visual', 'a', '视觉的'),
        ('envision', 'v', '展望'),
        ('survey', 'n', '调查'),
        ('supervise', 'v', '监督'),
    ]),
    ('mot', 'mot/mob', '移动', '拉丁语 movere', '#E74C3C', 4, [
        ('motor', 'n', '发动机'),
        ('motion', 'n', '运动'),
        ('emotion', 'n', '情感'),
        ('emotional', 'a', '情感的'),
        ('promote', 'v', '促进'),
        ('remote', 'a', '遥远的'),
        ('motivation', 'n', '动机'),
        ('mobile', 'a', '移动的'),
        ('automobile', 'n', '汽车'),
        ('momentum', 'n', '势头；动量'),
        ('mob', 'n', '暴民'),
    ]),
    ('ply', 'ply/pli', '折/填', '拉丁语 plicare', '#3498DB', 5, [
        ('apply', 'v', '申请；应用'),
        ('supply', 'v', '供应'),
        ('reply', 'v', '回复'),
        ('imply', 'v', '暗示'),
        ('comply', 'v', '遵守'),
        ('display', 'v', '展示'),
        ('employ', 'v', '雇佣'),
        ('deploy', 'v', '部署'),
        ('multiply', 'v', '乘；增加'),
    ]),
    ('coun', 'count/com', '计算/一起', '拉丁语 computare', '#27AE60', 3, [
        ('account', 'n', '账户；描述'),
        ('count', 'v', '计数'),
        ('counter', 'n', '柜台；计数器'),
        ('country', 'n', '国家'),
        ('encounter', 'v', '遭遇'),
        ('discount', 'n', '折扣'),
        ('amount', 'n', '数量'),
        ('mount', 'v', '安装；攀登'),
        ('mountain', 'n', '山'),
        ('fountain', 'n', '喷泉'),
    ]),
    ('mun', 'mun/mut', '交换/共同', '拉丁语 munus', '#C0392B', 5, [
        ('community', 'n', '社区'),
        ('communicate', 'v', '交流'),
        ('communication', 'n', '通信'),
        ('common', 'a', '共同的'),
        ('immune', 'a', '免疫的'),
        ('municipal', 'a', '市政的'),
        ('mutual', 'a', '相互的'),
        ('commute', 'v', '通勤'),
    ]),
    ('cul', 'cult', '耕种/培养', '拉丁语 colere', '#16A085', 4, [
        ('culture', 'n', '文化'),
        ('cultural', 'a', '文化的'),
        ('agriculture', 'n', '农业'),
        ('cultivate', 'v', '培养'),
        ('cultivation', 'n', '耕种；培养'),
        ('faculty', 'n', '能力；院系'),
        ('difficulty', 'n', '困难'),
        ('particular', 'a', '特定的'),
    ]),
    ('quest', 'quest/quir', '寻求/询问', '拉丁语 quaerere', '#2980B9', 5, [
        ('question', 'n', '问题'),
        ('request', 'v', '请求'),
        ('require', 'v', '要求'),
        ('requirement', 'n', '要求'),
        ('acquire', 'v', '获得'),
        ('acquisition', 'n', '收购'),
        ('inquire', 'v', '询问'),
        ('inquiry', 'n', '调查'),
        ('conquer', 'v', '征服'),
        ('conquest', 'n', '征服'),
    ]),
    ('sol', 'sol', '太阳/单独', '拉丁语 sol/solus', '#F1C40F', 5, [
        ('solar', 'a', '太阳的'),
        ('solve', 'v', '解决'),
        ('solution', 'n', '解决方案'),
        ('resolve', 'v', '解决；决心'),
        ('absolute', 'a', '绝对的'),
        ('solo', 'a', '单独的'),
        ('solid', 'a', '固体的；坚固的'),
        ('isolate', 'v', '隔离'),
        ('console', 'v', '安慰'),
        ('dissolve', 'v', '溶解'),
    ]),
    ('ment', 'ment/mind', '心智/思考', '拉丁语 mens', '#9B59B6', 4, [
        ('mental', 'a', '精神的'),
        ('mention', 'v', '提到'),
        ('comment', 'n', '评论'),
        ('moment', 'n', '时刻'),
        ('monument', 'n', '纪念碑'),
        ('document', 'n', '文件'),
        ('experiment', 'n', '实验'),
        ('instrument', 'n', '仪器'),
        ('argument', 'n', '争论'),
        ('element', 'n', '元素'),
        ('supplement', 'n', '补充'),
        ('implement', 'v', '实施'),
        ('fundamental', 'a', '基本的'),
        ('mental', 'a', '心理的'),
        ('remind', 'v', '提醒'),
        ('mind', 'n', '思维'),
    ]),
    ('par', 'par/pair', '准备/相等', '拉丁语 parare', '#E67E22', 4, [
        ('compare', 'v', '比较'),
        ('prepare', 'v', '准备'),
        ('separate', 'v', '分离'),
        ('repair', 'v', '修理'),
        ('pair', 'n', '一对'),
        ('apparent', 'a', '明显的'),
        ('parallel', 'a', '平行的'),
        ('parent', 'n', '父母'),
        ('transparent', 'a', '透明的'),
    ]),
    ('hab', 'hab/hibit', '拥有/居住', '拉丁语 habere', '#2ECC71', 5, [
        ('habit', 'n', '习惯'),
        ('inhabit', 'v', '居住'),
        ('habitat', 'n', '栖息地'),
        ('exhibit', 'v', '展览'),
        ('exhibition', 'n', '展览会'),
        ('prohibit', 'v', '禁止'),
        ('inhibit', 'v', '抑制'),
        ('inhabit', 'v', '栖息'),
        ('rehabilitate', 'v', '康复'),
    ]),
    ('clar2', 'claim/clam', '喊叫/宣称', '拉丁语 clamare', '#E74C3C', 5, [
        ('claim', 'v', '声称；要求'),
        ('exclaim', 'v', '惊叫'),
        ('proclaim', 'v', '宣告'),
        ('acclaim', 'n', '称赞'),
        ('reclaim', 'v', '回收'),
        ('disclaim', 'v', '否认'),
        ('disclaimer', 'n', '免责声明'),
    ]),
    ('mark2', 'mark/merc', '标记/贸易', '日耳曼语', '#F39C12', 4, [
        ('market', 'n', '市场'),
        ('marketing', 'n', '市场营销'),
        ('trademark', 'n', '商标'),
        ('supermarket', 'n', '超市'),
        ('merchant', 'n', '商人'),
        ('commerce', 'n', '商业'),
        ('commercial', 'a', '商业的'),
        ('merchandise', 'n', '商品'),
        ('remark', 'n', '评论'),
        ('remarkable', 'a', '非凡的'),
        ('landmark', 'n', '地标'),
        ('benchmark', 'n', '基准'),
    ]),
    ('lev', 'lev/light', '轻/举起', '拉丁语 levis', '#1ABC9C', 5, [
        ('level', 'n', '水平'),
        ('lever', 'n', '杠杆'),
        ('elevate', 'v', '提升'),
        ('elevator', 'n', '电梯'),
        ('relieve', 'v', '缓解'),
        ('relief', 'n', '救济；浮雕'),
        ('relevant', 'a', '相关的'),
        ('alleviate', 'v', '减轻'),
        ('leverage', 'n', '杠杆作用'),
    ]),
    ('clos', 'clos/clud', '关闭', '拉丁语 claudere', '#8E44AD', 5, [
        ('close', 'v', '关闭'),
        ('closet', 'n', '壁橱'),
        ('disclose', 'v', '披露'),
        ('enclose', 'v', '围住'),
        ('closure', 'n', '关闭；终止'),
        ('exclusive', 'a', '独有的'),
    ]),
    ('heal', 'heal/hol', '健康/完整', '日耳曼语', '#27AE60', 3, [
        ('health', 'n', '健康'),
        ('healthy', 'a', '健康的'),
        ('heal', 'v', '治愈'),
        ('whole', 'a', '完整的'),
        ('wholesale', 'n', '批发'),
        ('welfare', 'n', '福利'),
    ]),
    ('spec2', 'speci/spec', '种类/外观', '拉丁语 species', '#C0392B', 4, [
        ('special', 'a', '特殊的'),
        ('specialist', 'n', '专家'),
        ('specific', 'a', '具体的'),
        ('species', 'n', '物种'),
        ('specimen', 'n', '样本'),
        ('specify', 'v', '指定'),
        ('specialize', 'v', '专攻'),
        ('specialty', 'n', '专业'),
        ('especially', 'ad', '尤其'),
    ]),
    ('just', 'just/jur', '正义/法律', '拉丁语 jus', '#3498DB', 4, [
        ('just', 'ad', '刚刚；正义的'),
        ('justice', 'n', '正义'),
        ('justify', 'v', '证明…正当'),
        ('adjust', 'v', '调整'),
        ('adjustment', 'n', '调整'),
        ('jury', 'n', '陪审团'),
        ('injure', 'v', '伤害'),
        ('injury', 'n', '伤害'),
    ]),
    ('bord', 'bound/band', '边界/束缚', '法语 bonde', '#16A085', 5, [
        ('bound', 'a', '被束缚的'),
        ('boundary', 'n', '边界'),
        ('border', 'n', '边境'),
        ('bond', 'n', '纽带；债券'),
        ('band', 'n', '乐队；带'),
        ('abandon', 'v', '放弃'),
        ('abundant', 'a', '丰富的'),
        ('rebound', 'v', '反弹'),
    ]),
    ('div', 'div/dis', '分开/不同', '拉丁语 dividere', '#2980B9', 4, [
        ('divide', 'v', '分割'),
        ('division', 'n', '分裂；部门'),
        ('individual', 'n', '个人'),
        ('diverse', 'a', '多样的'),
        ('diversity', 'n', '多样性'),
        ('divorce', 'n', '离婚'),
        ('device', 'n', '设备'),
        ('devise', 'v', '设计'),
    ]),
    ('cover', 'cover/cov', '覆盖', '拉丁语 cooperire', '#E74C3C', 3, [
        ('cover', 'v', '覆盖'),
        ('discover', 'v', '发现'),
        ('discovery', 'n', '发现'),
        ('recover', 'v', '恢复'),
        ('recovery', 'n', '恢复'),
        ('uncover', 'v', '揭露'),
    ]),
    ('tain', 'tain/tin', '保持/拿', '拉丁语 tenere', '#F1C40F', 4, [
        ('contain', 'v', '包含'),
        ('container', 'n', '容器'),
        ('obtain', 'v', '获得'),
        ('maintain', 'v', '维护'),
        ('sustain', 'v', '维持'),
        ('retain', 'v', '保留'),
        ('detain', 'v', '拘留'),
        ('entertain', 'v', '娱乐'),
        ('entertainment', 'n', '娱乐'),
        ('attain', 'v', '达到'),
        ('certain', 'a', '确定的'),
        ('captain', 'n', '队长；船长'),
        ('curtain', 'n', '窗帘'),
    ]),
    ('soci', 'soci', '同伴/社会', '拉丁语 socius', '#9B59B6', 4, [
        ('social', 'a', '社会的'),
        ('society', 'n', '社会'),
        ('associate', 'v', '联系'),
        ('association', 'n', '协会'),
        ('negotiate', 'v', '谈判'),
        ('sociology', 'n', '社会学'),
    ]),
    ('pract', 'pract/prax', '实践', '希腊语 praktikos', '#E67E22', 4, [
        ('practice', 'n', '练习；实践'),
        ('practical', 'a', '实际的'),
        ('practitioner', 'n', '从业者'),
        ('impractical', 'a', '不切实际的'),
        ('malpractice', 'n', '渎职'),
    ]),
    ('termin', 'termin', '终端/界限', '拉丁语 terminus', '#1ABC9C', 5, [
        ('term', 'n', '术语；学期'),
        ('terminal', 'n', '终端'),
        ('terminate', 'v', '终止'),
        ('determine', 'v', '决定'),
        ('determination', 'n', '决心'),
        ('exterminate', 'v', '消灭'),
    ]),
    ('dom', 'dom/domin', '统治/家', '拉丁语 dominus', '#3498DB', 5, [
        ('domain', 'n', '领域'),
        ('domestic', 'a', '国内的'),
        ('dominate', 'v', '支配'),
        ('dominant', 'a', '主导的'),
        ('kingdom', 'n', '王国'),
        ('freedom', 'n', '自由'),
        ('wisdom', 'n', '智慧'),
        ('random', 'a', '随机的'),
    ]),
    ('poli', 'poli/polis', '城邦/政治', '希腊语 polis', '#C0392B', 4, [
        ('policy', 'n', '政策'),
        ('politics', 'n', '政治'),
        ('political', 'a', '政治的'),
        ('police', 'n', '警察'),
        ('polite', 'a', '礼貌的'),
        ('metropolitan', 'a', '大都市的'),
        ('cosmopolitan', 'a', '世界性的'),
    ]),
    ('logy', 'log/logy', '学科/理论', '希腊语 logos', '#8E44AD', 5, [
        ('technology', 'n', '技术'),
        ('biology', 'n', '生物学'),
        ('psychology', 'n', '心理学'),
        ('ecology', 'n', '生态学'),
        ('ideology', 'n', '意识形态'),
        ('methodology', 'n', '方法论'),
        ('apology', 'n', '道歉'),
        ('catalog', 'n', '目录'),
        ('dialogue', 'n', '对话'),
        ('analogy', 'n', '类比'),
    ]),
    ('ques', 'quest/quer', '抱怨/质问', '拉丁语 queri', '#27AE60', 6, [
        ('quarrel', 'n', '争吵'),
        ('query', 'n', '疑问'),
        ('complain', 'v', '抱怨'),
        ('complaint', 'n', '投诉'),
    ]),
    ('grad', 'grad/gress', '步/级', '拉丁语 gradus', '#F39C12', 5, [
        ('grade', 'n', '等级；年级'),
        ('graduate', 'v', '毕业'),
        ('gradual', 'a', '逐渐的'),
        ('upgrade', 'v', '升级'),
        ('degrade', 'v', '降级'),
        ('undergraduate', 'n', '本科生'),
        ('ingredient', 'n', '成分'),
    ]),
    ('point', 'point/punct', '点/刺', '拉丁语 punctum', '#16A085', 4, [
        ('point', 'n', '点；要点'),
        ('appoint', 'v', '任命'),
        ('appointment', 'n', '约会；任命'),
        ('disappoint', 'v', '使失望'),
        ('punctual', 'a', '准时的'),
        ('puncture', 'n', '穿刺'),
        ('viewpoint', 'n', '观点'),
    ]),
    ('ver', 'ver/veri', '真实', '拉丁语 verus', '#2980B9', 5, [
        ('very', 'ad', '非常'),
        ('verify', 'v', '验证'),
        ('version', 'n', '版本'),
        ('verdict', 'n', '裁决'),
        ('universal', 'a', '普遍的'),
        ('universe', 'n', '宇宙'),
        ('university', 'n', '大学'),
        ('conversation', 'n', '对话'),
        ('anniversary', 'n', '周年纪念'),
    ]),
    ('eco', 'eco/oikos', '家/环境', '希腊语 oikos', '#27AE60', 5, [
        ('economy', 'n', '经济'),
        ('economic', 'a', '经济的'),
        ('economics', 'n', '经济学'),
        ('ecosystem', 'n', '生态系统'),
        ('ecology', 'n', '生态学'),
    ]),
    ('bio', 'bio', '生命', '希腊语 bios', '#1ABC9C', 5, [
        ('biology', 'n', '生物学'),
        ('biography', 'n', '传记'),
        ('antibiotic', 'n', '抗生素'),
        ('biodiversity', 'n', '生物多样性'),
        ('biochemistry', 'n', '生物化学'),
        ('biotechnology', 'n', '生物技术'),
    ]),
    ('clim', 'clim/clin', '倾斜/气候', '希腊语 klima', '#E74C3C', 5, [
        ('climate', 'n', '气候'),
        ('climb', 'v', '攀爬'),
        ('decline', 'v', '下降'),
        ('incline', 'v', '倾向'),
        ('clinic', 'n', '诊所'),
        ('clinical', 'a', '临床的'),
    ]),
    ('cent', 'cent/centr', '百/中心', '拉丁语 centum', '#F1C40F', 4, [
        ('center', 'n', '中心'),
        ('central', 'a', '中心的'),
        ('century', 'n', '世纪'),
        ('percent', 'n', '百分比'),
        ('concentrate', 'v', '集中'),
        ('concern', 'n', '关心'),
        ('concert', 'n', '音乐会'),
        ('incentive', 'n', '激励'),
        ('accent', 'n', '口音'),
        ('innocent', 'a', '无辜的'),
        ('decent', 'a', '体面的'),
        ('recent', 'a', '最近的'),
    ]),
    ('preci', 'preci/prais', '价值/赞扬', '拉丁语 pretium', '#9B59B6', 5, [
        ('price', 'n', '价格'),
        ('precious', 'a', '珍贵的'),
        ('appreciate', 'v', '感激；欣赏'),
        ('praise', 'v', '赞扬'),
        ('appraise', 'v', '评价'),
        ('enterprise', 'n', '企业'),
    ]),
    ('pass', 'pass/pat', '通过/忍受', '拉丁语 passus', '#3498DB', 3, [
        ('pass', 'v', '通过'),
        ('passage', 'n', '通道'),
        ('passenger', 'n', '乘客'),
        ('passport', 'n', '护照'),
        ('passion', 'n', '激情'),
        ('passive', 'a', '被动的'),
        ('compassion', 'n', '同情'),
        ('patient', 'a', '耐心的'),
        ('patience', 'n', '耐心'),
    ]),
    ('rang', 'rang/rank', '排列/范围', '法语 rang', '#E67E22', 5, [
        ('range', 'n', '范围'),
        ('arrange', 'v', '安排'),
        ('arrangement', 'n', '安排'),
        ('rank', 'n', '等级'),
        ('exchange', 'n', '交换'),
        ('challenge', 'n', '挑战'),
        ('strange', 'a', '奇怪的'),
        ('stranger', 'n', '陌生人'),
    ]),
    ('net', 'net/nect', '连接/网', '拉丁语 nectere', '#16A085', 5, [
        ('network', 'n', '网络'),
        ('internet', 'n', '互联网'),
        ('connect', 'v', '连接'),
        ('connection', 'n', '连接'),
        ('disconnect', 'v', '断开'),
    ]),
    ('mass', 'mass/magn', '大/块', '拉丁语 massa', '#C0392B', 5, [
        ('mass', 'n', '大量；质量'),
        ('massive', 'a', '巨大的'),
        ('master', 'n', '大师'),
        ('masterpiece', 'n', '杰作'),
        ('disaster', 'n', '灾难'),
        ('major', 'a', '主要的'),
        ('majority', 'n', '多数'),
        ('mayor', 'n', '市长'),
        ('maximum', 'n', '最大值'),
    ]),
    ('crit', 'crit/cris', '判断/危机', '希腊语 krinein', '#2980B9', 5, [
        ('crisis', 'n', '危机'),
        ('critic', 'n', '批评家'),
        ('critical', 'a', '关键的；批判的'),
        ('criticism', 'n', '批评'),
        ('criteria', 'n', '标准'),
        ('crime', 'n', '犯罪'),
        ('criminal', 'n', '罪犯'),
    ]),
    ('mater', 'mater/matr', '母亲/物质', '拉丁语 mater', '#8E44AD', 5, [
        ('material', 'n', '材料'),
        ('matter', 'n', '事情；物质'),
        ('mature', 'a', '成熟的'),
        ('matrix', 'n', '矩阵'),
        ('maternal', 'a', '母亲的'),
    ]),
    ('stru2', 'stri/stru', '拉/条纹', '拉丁语 stringere', '#27AE60', 6, [
        ('strategy', 'n', '策略'),
        ('strategic', 'a', '战略的'),
        ('strict', 'a', '严格的'),
        ('restrict', 'v', '限制'),
        ('restriction', 'n', '限制'),
        ('district', 'n', '地区'),
        ('string', 'n', '绳；字符串'),
        ('strip', 'n', '条'),
        ('strike', 'v', '打击；罢工'),
        ('struggle', 'v', '斗争'),
        ('stream', 'n', '溪流'),
        ('stress', 'n', '压力'),
    ]),
    ('camp', 'camp/champ', '田野/战场', '拉丁语 campus', '#F39C12', 4, [
        ('camp', 'n', '营地'),
        ('campaign', 'n', '运动；战役'),
        ('campus', 'n', '校园'),
        ('champion', 'n', '冠军'),
        ('championship', 'n', '锦标赛'),
        ('sample', 'n', '样本'),
        ('example', 'n', '例子'),
    ]),
    ('poss', 'poss/pot', '力量/可能', '拉丁语 posse', '#1ABC9C', 4, [
        ('possible', 'a', '可能的'),
        ('possibility', 'n', '可能性'),
        ('impossible', 'a', '不可能的'),
        ('potential', 'a', '潜在的'),
        ('power', 'n', '力量'),
        ('powerful', 'a', '强大的'),
        ('possess', 'v', '拥有'),
        ('possession', 'n', '拥有'),
    ]),
    ('found', 'found/fund', '基础/底部', '拉丁语 fundus', '#E74C3C', 5, [
        ('found', 'v', '创立'),
        ('foundation', 'n', '基金会；基础'),
        ('founder', 'n', '创始人'),
        ('fund', 'n', '基金'),
        ('fundamental', 'a', '基本的'),
        ('profound', 'a', '深刻的'),
        ('refund', 'n', '退款'),
    ]),
    ('lead', 'lead/lib', '引导/自由', '日耳曼语', '#F1C40F', 3, [
        ('lead', 'v', '引导'),
        ('leader', 'n', '领导者'),
        ('leadership', 'n', '领导力'),
        ('mislead', 'v', '误导'),
        ('league', 'n', '联盟'),
        ('colleague', 'n', '同事'),
        ('legacy', 'n', '遗产'),
        ('legal', 'a', '合法的'),
        ('legislation', 'n', '立法'),
        ('legitimate', 'a', '合法的'),
    ]),
]

# Colors for variety
colors_pool = ['#E74C3C','#3498DB','#2ECC71','#9B59B6','#F39C12','#1ABC9C',
               '#E67E22','#27AE60','#C0392B','#8E44AD','#2980B9','#16A085','#F1C40F']

# Add new roots to the database
added_words = 0
for i, (rid, root, meaning, origin, color, level, words) in enumerate(new_roots_data):
    root_entry = {
        'id': rid,
        'root': root,
        'meaning': meaning,
        'origin': origin,
        'color': color,
        'level': level,
        'words': []
    }
    for word, pos, wmean in words:
        wl = word.lower()
        if wl not in existing_root_words:
            root_entry['words'].append({'word': word, 'pos': pos, 'meaning': wmean})
            existing_root_words.add(wl)
            if wl in all_supp:
                assigned.add(wl)
            added_words += 1
    if root_entry['words']:  # Only add if has words
        roots.append(root_entry)

# Also add more words to existing roots where they genuinely belong
extra_for_existing = {
    'port': [
        ('airport', 'n', '机场'), ('portfolio', 'n', '文件夹；作品集'),
        ('opportunity', 'n', '机会'), ('proportion', 'n', '比例'),
    ],
    'duct': [
        ('product', 'n', '产品'), ('production', 'n', '生产'),
        ('productivity', 'n', '生产力'), ('conduct', 'v', '引导；进行'),
    ],
    'spect': [
        ('aspect', 'n', '方面'), ('perspective', 'n', '视角'),
        ('spectrum', 'n', '光谱'), ('spectacle', 'n', '景象'),
    ],
    'ject': [
        ('subject', 'n', '主题'), ('objective', 'n', '目标'),
    ],
    'struct': [
        ('infrastructure', 'n', '基础设施'), ('destruction', 'n', '破坏'),
        ('restructure', 'v', '重组'),
    ],
    'cap': [
        ('capital', 'n', '首都；资本'), ('capable', 'a', '有能力的'),
        ('capacity', 'n', '能力；容量'), ('capsule', 'n', '胶囊'),
    ],
    'ced': [
        ('succeed', 'v', '成功'), ('success', 'n', '成功'),
        ('proceed', 'v', '继续'), ('process', 'n', '过程'),
        ('procedure', 'n', '程序'), ('access', 'n', '访问'),
        ('necessary', 'a', '必要的'), ('predecessor', 'n', '前任'),
    ],
    'press': [
        ('expression', 'n', '表达'), ('impression', 'n', '印象'),
        ('impressive', 'a', '令人印象深刻的'),
    ],
    'fac': [
        ('factor', 'n', '因素'), ('factory', 'n', '工厂'),
        ('facility', 'n', '设施'), ('satisfaction', 'n', '满意'),
        ('affect', 'v', '影响'), ('effect', 'n', '效果'),
        ('effective', 'a', '有效的'), ('efficient', 'a', '高效的'),
        ('sufficient', 'a', '足够的'),
    ],
    'vis': [
        ('vision', 'n', '视力；愿景'), ('visible', 'a', '可见的'),
        ('visit', 'v', '访问'), ('advise', 'v', '建议'),
        ('revise', 'v', '修改'), ('television', 'n', '电视'),
    ],
    'form': [
        ('reform', 'v', '改革'), ('inform', 'v', '通知'),
        ('information', 'n', '信息'), ('performance', 'n', '表现'),
        ('platform', 'n', '平台'), ('uniform', 'n', '制服'),
        ('formula', 'n', '公式'),
    ],
    'gen': [
        ('generate', 'v', '产生'), ('generation', 'n', '一代'),
        ('gene', 'n', '基因'), ('genius', 'n', '天才'),
        ('genuine', 'a', '真正的'), ('gender', 'n', '性别'),
        ('generous', 'a', '慷慨的'), ('gentle', 'a', '温柔的'),
        ('engine', 'n', '引擎'), ('engineer', 'n', '工程师'),
        ('emergency', 'n', '紧急情况'),
    ],
    'act': [
        ('action', 'n', '行动'), ('active', 'a', '积极的'),
        ('activity', 'n', '活动'), ('actual', 'a', '实际的'),
        ('react', 'v', '反应'), ('reaction', 'n', '反应'),
        ('interact', 'v', '互动'), ('transaction', 'n', '交易'),
        ('exact', 'a', '精确的'), ('practice', 'n', '实践'),
    ],
    'loc': [
        ('local', 'a', '本地的'), ('locate', 'v', '定位'),
        ('location', 'n', '位置'), ('allocate', 'v', '分配'),
        ('block', 'n', '街区'),
    ],
    'sign': [
        ('signal', 'n', '信号'), ('significant', 'a', '重要的'),
        ('design', 'v', '设计'), ('assign', 'v', '分配'),
        ('resign', 'v', '辞职'),
    ],
    'mov': [
        ('move', 'v', '移动'), ('movement', 'n', '运动'),
        ('movie', 'n', '电影'), ('remove', 'v', '移除'),
        ('improve', 'v', '改善'), ('improvement', 'n', '改善'),
    ],
    'reg': [
        ('region', 'n', '地区'), ('regular', 'a', '常规的'),
        ('regulate', 'v', '调节'), ('regulation', 'n', '规定'),
        ('regime', 'n', '政权'),
    ],
    'fin': [
        ('final', 'a', '最终的'), ('finance', 'n', '金融'),
        ('financial', 'a', '金融的'), ('fine', 'a', '好的'),
        ('define', 'v', '定义'), ('definition', 'n', '定义'),
        ('finish', 'v', '完成'), ('infinite', 'a', '无限的'),
        ('confine', 'v', '限制'),
    ],
    'equ': [
        ('equal', 'a', '相等的'), ('adequate', 'a', '充分的'),
        ('equation', 'n', '方程式'), ('equipment', 'n', '设备'),
        ('equivalent', 'a', '等价的'), ('frequency', 'n', '频率'),
    ],
    'nat': [
        ('nature', 'n', '自然'), ('natural', 'a', '自然的'),
        ('nation', 'n', '国家'), ('national', 'a', '国家的'),
        ('international', 'a', '国际的'), ('native', 'a', '本地的'),
    ],
    'sens': [
        ('sense', 'n', '感觉'), ('sensitive', 'a', '敏感的'),
        ('sensible', 'a', '明智的'), ('essential', 'a', '基本的'),
        ('consent', 'v', '同意'), ('sentence', 'n', '句子'),
    ],
    'man': [
        ('manage', 'v', '管理'), ('management', 'n', '管理'),
        ('manager', 'n', '经理'), ('manner', 'n', '方式'),
        ('manufacture', 'v', '制造'), ('manuscript', 'n', '手稿'),
    ],
    'mem': [
        ('memory', 'n', '记忆'), ('remember', 'v', '记住'),
        ('member', 'n', '成员'), ('membership', 'n', '会员资格'),
        ('memorial', 'n', '纪念碑'), ('memo', 'n', '备忘录'),
    ],
    'pend': [
        ('depend', 'v', '依赖'), ('independent', 'a', '独立的'),
        ('spend', 'v', '花费'), ('expense', 'n', '费用'),
        ('expensive', 'a', '昂贵的'), ('compensate', 'v', '补偿'),
    ],
    'tract': [
        ('attract', 'v', '吸引'), ('attractive', 'a', '有吸引力的'),
        ('contract', 'n', '合同'), ('extract', 'v', '提取'),
        ('abstract', 'a', '抽象的'), ('distract', 'v', '分心'),
    ],
    'mit': [
        ('commit', 'v', '承诺'), ('committee', 'n', '委员会'),
        ('submit', 'v', '提交'), ('permit', 'v', '允许'),
        ('admit', 'v', '承认'), ('limit', 'n', '限制'),
        ('mission', 'n', '使命'), ('emission', 'n', '排放'),
    ],
    'cred': [
        ('credit', 'n', '信用'), ('incredible', 'a', '难以置信的'),
        ('credential', 'n', '资质'),
    ],
}

for root_id, extra_words in extra_for_existing.items():
    root_entry = None
    for r in roots:
        if r['id'] == root_id:
            root_entry = r
            break
    if not root_entry:
        continue
    for word, pos, wmean in extra_words:
        wl = word.lower()
        if wl not in existing_root_words:
            root_entry['words'].append({'word': word, 'pos': pos, 'meaning': wmean})
            existing_root_words.add(wl)
            if wl in all_supp:
                assigned.add(wl)
            added_words += 1

# Remove assigned words from supplement
new_supplement = {}
for cat, words in supplement.items():
    remaining = [w for w in words if w['word'].lower() not in assigned]
    if remaining:
        new_supplement[cat] = remaining

# Update stats
total_root_words = sum(len(r['words']) for r in roots)
total_supp_words = sum(len(v) for v in new_supplement.values())

db['roots'] = roots
db['supplement'] = new_supplement
db['stats'] = {
    'rootCount': len(roots),
    'rootWordCount': total_root_words,
    'supplementWordCount': total_supp_words,
    'totalWordCount': total_root_words + total_supp_words,
}

with open(RAW_PATH, 'w') as f:
    json.dump(db, f, ensure_ascii=False, separators=(',', ':'))

print(f'Added {added_words} new words to roots')
print(f'New root count: {len(roots)}')
print(f'Root words: {total_root_words}')
print(f'Supplement words: {total_supp_words}')
print(f'Total: {total_root_words + total_supp_words}')
print(f'Words moved from supplement: {len(assigned)}')
