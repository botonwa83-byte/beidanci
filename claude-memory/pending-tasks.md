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

## ✅ 懒人背单词模式（2026-06-11 提出并当日完成）
- **实现**：`src/data/lazySession.ts`（纯逻辑）+ `src/screens/LazyModeScreen.tsx`（路由名 'Lazy'），LearnScreen 仪表盘 CTA 下方入口「😴 懒人模式 · 盯着看就行」
- **节奏**：每词 8 秒（词+自动朗读 → 2.5s 释义 → 4s 例句+身世故事），第 2/3 遍释义延迟到 3s（回忆窗口）；点屏暂停/继续，切后台自动暂停（AppState）
- **短期曲线**：新词每批曝光 3 遍，三轮旋转错位编排（offset ≤ n-MIN_GAP-1 保证同词间隔 >MIN_GAP=2），复习词拆两半垫轮次间
- **长期曲线**：批次结束 quality=3 写 SM-2（被动无自评取中性），与手动模式共用 progress/mission/门禁(FREE_WORD_LIMIT)；结算页可"再来一批"
- **顺手修**：finishLazySession 把 mission 挂上 progress 再标记——修了 todayMission 从未写回导致每日统计恒 0 的存量问题（手动模式仍未挂，待同步修）
- **人性化二轮（同日用户反馈后加）**：①开播前"本批预告页"（X新词×3遍+Y复习=Z步·约M分钟，点"开始躺 ▶"才播）；②顶栏常驻"剩~N分钟"；③词卡下 8 秒倒计时细条；④轮次小目标"第2遍·8/10"（lazySegments 切段）；⑤可拆词释义出现时亮词根块 chips；⑥过半提示"已过半稳住😌"；⑦结算页加连续天数+今日累计。设计原理：已知时长的等待耐心远高于未知；长批切小段制造完成势能
- lazySession.test.ts 6 项测试

## 近期开发任务（5 项，来自 [[redesign-plan-2026-06]]）
2. wordSenses 多义项扩展：**第三批 +115 已完成（2026-06-11）**，文件共 607 条、词库内命中 479/3731；继续向词频中段扩展（管线：jest 临时脚本导出未覆盖高频词→挑真多义词编写→python 合并）。注意：旧批次有 128 条键不在词库（fall/hand/head 等基础词），无害但提示编写必须从词库导出清单出发
3. ~~六级词表长尾缺口~~ **已完成（2026-06-11，两轮）**：①六级批 +775（自建 1754 词候选表 diff，入「六级核心」），顺手清理 14 个词根/补充双重建档重复词；②基础词批 +1384（自建 2256 词四级/基础候选表 diff 缺口 1451，剔除纯语法词后编写 1381+补 7，入「日常基础」）。词库 3731→4492→**5876**（全唯一）。附带收益：wordSenses 死条目激活（命中 479→601/607）、wordOrigins 命中 204→240/307（window/money/school 故事上线）；修复 wordSenses「March」大写键死条目（键已全部小写化）。可拆解 1895（32%）。注意：词 id 为构建时顺序分配，移词/删词会改变 id 布局，上架后不可再随意动（用户进度按 id 存）
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
