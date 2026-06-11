---
name: pending-tasks
description: WordPulse 全部未完成任务清单（2026-06-11 盘点），含优先级与风险标注
metadata: 
  node_type: memory
  type: project
  originSessionId: c8176f09-50b7-459b-80a4-83186c4d3e7a
---

# 待办任务清单（2026-06-11 盘点，同日新增词源宇宙计划；同日晚更新：内购风险解除、词源 A 项完成）

## ✅ 已解除：跨机内购代码风险（原最高优先级）
1. ~~另一台电脑的内购代码未提交~~ **已解决（2026-06-11）**：内购代码已在原电脑与远程最新代码合并并提交 master（LearnScreen 冲突已手工解决），tsc+jest 全过。**尚未推送 GitHub**——推送前另一台电脑不要再动代码。

## 新方向：词源宇宙（4 项，用户已拍板，见 [[etymology-universe-plan]]）
- A. ~~第一批 wordOrigins + 哑词"📜 身世"卡~~ **已完成（2026-06-11）**：wordOrigins.json 307 条（首批 149 + 二批 158，二批全部从词库高频哑词导出编写），词库内命中 204 词；getWordOrigin() 挂载 wordDatabase，身世卡已上线学习卡揭晓后（LearnScreen，琥珀色 originCard）+ 详情页（WordDetailScreen，联想记忆上方）；新增 wordOrigins.test.ts 4 项数据质量测试
- B. ~~今日词源冷知识 + 分享卡~~ **已完成（2026-06-11）**：`src/data/dailyTrivia.ts`（getDailyTrivia 按日期×质数131跳步取 307 条故事池含词库外故事；buildTriviaShareMessage 配 slogan"没有一个单词是凭空来的"）；卡片在猜词页滚动区末尾（琥珀色 triviaCard，词可朗读+分享↗按钮走 RN Share 零原生依赖）；dailyTrivia.test.ts 3 项测试
- C. ~~猜来历题型~~ **已完成（2026-06-11）**：`src/data/originQuiz.ts` 48 道手写选择题（choices[0] 恒正确、出题洗牌，explanation 直取 wordOrigins 身世故事="答错也开心"）；Question type 新增 'origin-quiz'；generateReviewQuestions 每场复习随机位置混入 1 道（无 wordId 不进 SM-2）；答对不自动跳题让用户读完故事（ReviewScreen）；originQuiz.test.ts 4 项测试
- D. 词源版图（替代原阶段4星系图，#6 作废合并于此）← 词源宇宙仅剩此项，计划放下个大版本

## 新需求：懒人背单词模式（2026-06-11 用户提出，待设计实现）
- **核心交互**：用户只需停留看着单词，每词自动展示 8 秒后自动跳下一个——零操作、可瘫着背
- **记忆调度**：靠记忆曲线（间隔重复）安排重复出现，同一批词在会话内/跨天不断回流，重复中完成记忆
- 设计时再定的细节：8 秒内的展示节奏（先词后义？分段揭晓？）、是否朗读、批次大小、与现有 SM-2/每日任务及学习门禁(FREE_WORD_LIMIT)的关系、入口放哪（学习 tab 新模式 / 独立模式切换）
- 命名候选：懒人模式 / 自动驾驶模式（贴合"超能力"叙事可叫"自动破译"）

## 近期开发任务（5 项，来自 [[redesign-plan-2026-06]]）
2. wordSenses 多义项扩展：**第三批 +115 已完成（2026-06-11）**，文件共 607 条、词库内命中 479/3731；继续向词频中段扩展（管线：jest 临时脚本导出未覆盖高频词→挑真多义词编写→python 合并）。注意：旧批次有 128 条键不在词库（fall/hand/head 等基础词），无害但提示编写必须从词库导出清单出发
3. 六级词表长尾缺口：对照完整六级词表 diff 补词（已两批 +264）
4. 哑词扩词根：剩约 2089 个单块词（其中相当部分是真不可拆的独立词，到顶约 60% 可拆率）
5. 全库词源审计 + buildMorphemes 恒真条件 bug（**2026-06-11 已完成侦察，结论如下**）：
   - bug 位置：wordDatabase.ts buildMorphemes 前缀校验 `afterPrefix.slice(0,1) + afterPrefix.slice(1).startsWith(rootId.slice(1))`——字符串拼布尔恒为真值，任何前缀都放行
   - 影响面：1086 个带前缀拆解中 **491 个依赖恒真分支**（用 jest 临时脚本对存量 morphemes 重放"本意条件"测得）
   - **关键：不能简单改成严格条件**——491 个里大量是正确的表层变体拆解（produce=pro+duc(t 脱落)、expect=ex+(s)pect 同化、description=de+scrib），恒真 bug 是它们的承重墙
   - 真误拆集中在短词根：**ment**（achievement/apartment/department/excitement 等 -ment 后缀词被错当词根）、**min**（examine/contaminate/discrimination）、par（apart）等，与既有怀疑名单（min/ment/par/equ/grat/sol）吻合
   - 修复方向：写词根表层变体感知的存在性校验（允许末辅音脱落/首辅音同化），对短词根加严格白名单或 override，修完全量 diff 存量拆解人工审计；会改动 破译力/拼词工坊 的输入，测试需同步看
   - 复现脚本：临时 jest 测试遍历 allWords，对 morphemes[0].type==='prefix' 的词重放条件 `after.startsWith(rootId) || after.slice(1).startsWith(rootId.slice(1))`，不满足即依赖恒真分支
6. ~~词根星系图（原阶段4）~~ → 已并入词源宇宙 D（词源版图）
7. 收缩 tab（原阶段5）：语法并入词缀、6→5 ——**与内购冲突**：语法 tab 是 3 个付费门禁之一，撤 tab 前需重新设计门禁位置

## 猜词模块候选（3 项，低优先级）
8. 同根词网状可视化
9. 进阶模式（藏含义只给字母）
10. 战绩卡导出图片（需 react-native-view-shot 原生依赖，暂缓）

## 远期规划（3 项）
11. 内购服务端收据校验（防破解，上线后看情况）
12. Apple 登录（B方案）
13. iCloud 同步（C方案）

**统计（2026-06-11 晚更新）：内购风险已解除，词源宇宙 A/B/C 已完成、仅剩 D；新增懒人背单词模式 1 项。未完成 = 词源版图 D + 懒人模式 + 5 项近期 + 3 项候选 + 3 项远期 = 13 项。**
已完成不再列出：五波改造（破译力/先猜后揭/拼词工坊/扫荡/派生带学/词根贪心/形近辨析/家族化复习/词库 3731/多义项）详见 [[redesign-plan-2026-06]]。
