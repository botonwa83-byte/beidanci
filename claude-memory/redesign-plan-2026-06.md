---
name: redesign-plan-2026-06
description: "2026-06 反平庸改造计划——把词根拆解从\"展示\"变成\"玩法\"，五个阶段及进度"
metadata: 
  node_type: memory
  type: project
  originSessionId: c8176f09-50b7-459b-80a4-83186c4d3e7a
---

# 反平庸改造计划（2026-06-11 启动）

**诊断**：app 最值钱的资产是 149 词根 + 3467 词的逐块 morpheme 拆解数据，但主学习流没用它当玩法——词根只是卡片说明文字，quiz 是和方法论无关的四选一。唯一"主动推理"的体验在猜词模块（已验证好玩）。语法 tab 稀释主线。

**主线叙事**：全 app 统一到"猜词超能力/破译"——参见 [[app-patterns]] 超能力范式。

## 第二波：扩大战果（2026-06-11 用户拍板，全部采纳）

**用户核心诉求**：以点带面不够（杠杆只覆盖 1366/3467=39% 词库，且"可破译"无收割入口）；词库要覆盖六级大部分（缺口~2000）；**按记忆规律"带出"更多词汇**。

**记忆规律 → 带词机制的映射**：
- 扩散激活/联想网络 → 学锚点词立刻带出关联词（带学）
- 组块化 → 派生家族当一个 chunk 学（create→creation/creative/creator，后缀只是衣服）
- 生成效应 → 收割模式先猜后翻
- 对比辨析防干扰 → 形近词/同反义对比（getSimilarWords 已有，待接入复习）

机制清单：
- **B. 收割模式（⚡扫荡）**：dashboard 入口，把可破译词快速推流（碎片全亮→猜中文→翻开自评），猜对= markWordHarvested（interval 3 起步，推理记忆更牢），猜错=不动（留在常规队列）。一批 20 词
- **C. 词根贪心排序**：generateDailyMission 按"家族未学词数"降序挑词根，预览显示"学它解锁 X 词"
- **D. 派生带学（顺手带走全家）**：`src/data/wordFamilies.ts` 自动索引派生词（词干+已知后缀变体+e-drop/y→i 拼接命中词库即成链，union-find 连通分量）；session 中 word-learn 后插 word-family step：锚点+≤3 个未学派生词，一键"全带走"（quality 3 入 SRS）或跳过
- 同根快猜（原机制3）并入 B/D；家族化复习（扩散激活）和形近辨析待做
- 数据：补六级 ~2000 词 + 给 2101 个无拆解"哑词"补真实拆解（每补一个直接进破译力）——分批，下一波做

**第三波：数据扩充 + 记忆带词收尾（2026-06-11 完成，未提交）**：
- **词内基词分解（哑词升级二号通道）**：wordDatabase.ts 后置管线，单块词若= [前缀]+词库基词+[后缀]（全字母覆盖+释义共字）则用基词当词根块（happiness=happy+ness），块文本用基词原形对齐破译力 key。~90 词升级
- **词缀扩充**：前缀表加同化变体（ad→ac/ap/ar/as/at/af/ag/al/an, sub→sup/sus/suc/suf, in→im/il/ir, ob→oc/op/of, con→col/cor）；strict 词缀表加 EXTRA_PREFIX_DEFS/EXTRA_SUFFIX_DEFS（non/fore/semi…，ion/ation/ism/ship/hood/y/ish…）
- **词根表扩充**：rootsExtended.json +41 个真词源词根（vict/vinc/tect/stell/priv/sumpt/hes/sequ/secut/prehens/onym/psych/phon/metr/therm/hydr/astr/spir/rect/grav/leg…）。可拆解词 1366→~1620
- **词源质量关**：人工审查全部新拆解；DECOMPOSE_BLOCKLIST（turbulence/disturb/anesthesia/orchestrate/catastrophic/lucrative/tectonic/allegory 等假词源，宽松+严格路径都生效）；修复预存 bug：override 词根释义被错配词根覆盖（telephone 的 phon 曾显示"远"，现按块词根名查表）；astronomy/astronaut/atmosphere/thermometer 加人工 override
- **六级核心批次**：supplement 新类别"六级核心"+46 词（自查发现 171 个常考六级词中 125 个已在库——实际缺口比预想小，下批应对照完整六级词表 diff）。总词量 3467→3513
- **形近辨析**：generateReviewQuestions qType1 干扰项优先 getSimilarWords 形近词，解释里提示"注意形近词"
- **家族化复习**：LearnScreen review-card 翻面显示"🧲 全家：…"（扩散激活）
- 下批待做：对照完整六级词表补缺口、继续给哑词扩词根（剩~2080 单块词中相当部分是真不可拆的独立词）

**第五波：多义项释义（2026-06-11 完成，已推送 de09b9b）**：
- 用户反馈：释义太单一（transmission 只显示"传输"，缺"变速箱"），基本每个词都有此问题
- 诊断：数据层单义项 + 展示层 `meanings[]` 从未被 UI 使用（translationService 多义词典只覆盖 83 词）
- `src/data/wordSenses.json`：人工编写 330+ 高频多义词（来自词频 top450 导出），格式 word→义项数组，构建时合并进 meanings（优先级最高）
- `getFullMeaning(w)`（wordDatabase 导出）：多义项"；"连接，单义回退 meaning
- UI：LearnScreen 学习卡揭晓/扫荡翻开/复习卡翻面 ×3 处 + WordDetailScreen 编号义项列表；quiz 选项保持单义 meaning（紧凑+答案一致性）
- 待做：wordSenses 第二批继续向词频中段扩展（3731 词只覆盖了 330）

**第四波：复习流接入 + 六级第二批（2026-06-11 完成，已推送 1fe91a8）**：
- **ReviewScreen 拼词工坊**：generateReviewQuestions qType4 拼词/词根匹配交替（word.id 奇偶）；ReviewScreen 加 buildSel 多选瓦片 UI + 判定 + 底栏修正（answeredCorrectly 统一判定）+ 题型卡列表加"拼词工坊"
- **六级第二批 +218 词**（authored 492，274 已存在），六级核心类别共 264 词，**词库总量 3731，可拆解 1642（44%）**
- **第二轮词源审查**：新词自动拆解 41 个全审，17 个假词源进黑名单（accord/cordial=cor 心、nominate=nomen、segment=secare、spiral=speira、intent=tendere、latent=latere、eminent/predominant/preliminary≠min、emigrate 撞 grat、solidarity=solidus、torment=torquere、impart=pars、intact=tangere、persevere=severus、proximity=proximus）
- **系统性修复**：宽松路径词根匹配改为长度降序（extendedRootEntries），sequence 命中 sequ 而非 equ
- **已知遗留问题**（下批处理）：① buildMorphemes 前缀匹配条件恒真 bug（`afterPrefix.slice(0,1)+...startsWith()` 字符串拼接恒 truthy）→ 任何词首前缀变体都会被接受；② 存量旧词（非新词根触发）未做全库词源审计，min/ment/par/ord/act/equ/grat/sol 这类短词根的历史误拆可能还有；③ ReviewScreen 第一次 Edit 曾静默未落盘——改完必须 grep 验证

**B/C/D 已完成（2026-06-11，未提交）**：
- `src/data/wordFamilies.ts`：派生家族索引，后缀变体（主表 20 个 + EXTRA_SUFFIXES 补 ion/ation 等 16 个）+ e-drop/y→i + **中文释义共字语义校验**（挡 rat→ration、miss→mission 误连；important 这种语义不透明的也被排除——正确）。覆盖 707 词/318 家族
- learningLogic：`markWordHarvested`（收割词 interval 3 起步）、词根贪心（家族未学词数降序）、buildLearningSession 插 word-family step（≤3 卫星词、每组 ≤4 个家族步）
- LearnScreen：'harvest' 模式（琥珀色 #F59E0B 主题）+ dashboard 扫荡入口卡 + 词根预览"带出 X 词"徽章 + word-family 步骤 UI（锚点卡+卫星行+全带走/跳过）
- 测试：`__tests__/wordFamilies.test.ts` 4 个用例（覆盖率/对称性/排除已学/收割间隔）

## 五阶段（按冲击力/成本排序）

1. **隐性词汇量（破译力）计数器** ✅ 核心卖点数字化
   - `src/data/decipherPower.ts`：已学词的 morpheme 集合 → 覆盖词库中多少未学词（morphemes≥2 且全部已知 = 可破译）
   - 首页大字「已背 X 词 → 破译力覆盖 Y 词」；学完一组弹「+N 词解锁」
   - morpheme key = `type:text`（去连字符、小写）；learnedRootIds 的 root 变体（按 / 拆分）也算已知
2. **先猜后揭反转主学习流** ✅ 生成效应
   - LearnScreen word-learn step：先只显示单词+色块（已认识的碎片自动亮+✓，生词碎片点击翻开）→「揭晓含义」→ 释义/联想/例句/认识了按钮
   - 单 morpheme 词（无拆解）回退旧直显模式
3. **拼词工坊 quiz 题型** ✅ 用碎片拼词替换部分四选一
   - Question type 新增 `word-build`：给中文释义 + morpheme 瓦片（正确块+干扰块），多选判集合相等
   - 先只进 generateQuestions（学习流 quiz），ReviewScreen 不动
4. **词根星系图**（未做）：词库 tab 用纯 View 画词根节点+已学词点亮的星图，替代列表进度
5. **收缩 tab**（未做）：语法"词形变化"类并入词缀学习卡，撤语法 tab，6→5

## 状态
- 2026-06-11：**阶段 1-3 已完成**（未提交）。tsc/eslint 通过，新增 5 个单测全过
  - 新文件：`src/data/decipherPower.ts`、`__tests__/decipherPower.test.ts`、`__tests__/wordBuildQuestion.test.ts`
  - 改动：types.ts（Question 加 word-build）、learningLogic.ts（buildWordBuildQuestion，i%3===0 且 ≥2 碎片时替换 word-meaning 题）、LearnScreen.tsx（破译力卡/先猜后揭/拼词工坊/结算解锁数，紫色 #8B5CF6 主题）
  - 复习流（ReviewScreen/generateReviewQuestions）未动
- 阶段 4（词根星系图）、阶段 5（撤语法 tab）未做
- 已知：`__tests__/App.test.tsx` 在改造前就崩（App.tsx:159 setState after teardown），与本次无关
- 注意：改造前 working tree 已有未提交改动（LearnScreen 重构等），改造叠加其上
