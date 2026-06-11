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
5. ~~短词根误拆审计~~ **第三批审查已完成（2026-06-11），恒真条件保留待变干表**：
   - **已修**：①数据手术——22 个假成员移出词根家族进补充词表（equ 移出 equip/equipment/frequency；ment 移出 8 个 -mentum 词只留 mental/mention/comment/mind；sol 移出 solvere/solidus/solari/insula 系 7 词只留 solar/solo；par 移出 parere/希腊语系 4 词）；②`isSuffixOnlyMatch` 后缀同形守卫——词根子串只在词尾出现且与同形后缀重合不算命中，generic 修掉 achievement/ailment/amendment/fragment 等全部 -ment 误拆；③黑名单 +11（equip/equipment/frequency/solid/console/isolate/element/examine/contaminate/discrimination/establishment）；④手工 override +23 个真词源拆块（solv/solut 解开、par 显现·生育、monu 提醒、docu 教导、ple 填满、frag 打碎、parlia 商谈等）
   - 净效果：全库 3731 词中 50 词拆解变化，全部为修复或改善，jest 全过
   - **恒真条件原样保留**（buildMorphemes 前缀校验，已加注释说明）：实验证明简单收紧会误删几百个正确前缀——拉丁词根变干（cap/cip/cept、fac/fic/fect、ced/cess、quest/quir、vis/vic）超出 startsWith 规则；待将来建立**完整词根变干表**后再收紧。词根家族词表已净化，恒真条件残余危害仅限装饰性前缀块（如 action 显示 ac- 前缀）
   - 审计工具：jest 临时脚本 dump 全库 `word :: morphemes :: rootId` 排序快照，改动前后 diff 审查（本次三轮快照对比定位全部尾巴）
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
