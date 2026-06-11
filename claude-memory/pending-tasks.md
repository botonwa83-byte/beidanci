---
name: pending-tasks
description: WordPulse 全部未完成任务清单（2026-06-11 盘点），含优先级与风险标注
metadata: 
  node_type: memory
  type: project
  originSessionId: c8176f09-50b7-459b-80a4-83186c4d3e7a
---

# 待办任务清单（2026-06-11 盘点，同日新增词源宇宙计划）

## ⚠️ 最高优先级风险（1 项）
1. **另一台电脑的内购代码未提交**（见 [[freemium-model]]）：entitlementService/useEntitlement/PaywallScreen/3 处门禁/guessQuota/jest.setup（App.test 修复）只存在于那台机器。
   - 必须尽快在那台电脑 commit + push
   - **合并冲突预警**：门禁改了 LearnScreen startSession / GuessWordScreen / GrammarScreen，而本机五波改造大改了 LearnScreen——合并时 LearnScreen 必然冲突，需手工处理
   - 本机 App.test.tsx 仍失败，修复随内购代码一并到来

## 新方向：词源宇宙（4 项，用户已拍板，见 [[etymology-universe-plan]]）
- A. 第一批 wordOrigins（~300 高频哑词身世故事）+ 哑词"📜 身世"卡 ← **下一个动手项**
- B. 今日词源冷知识 + 分享卡（流行性最高杠杆）
- C. 猜来历题型（词源故事选择题）
- D. 词源版图（替代原阶段4星系图，#6 作废合并于此）

## 近期开发任务（5 项，来自 [[redesign-plan-2026-06]]）
2. wordSenses 多义项第二批+：继续向词频中段扩展（已覆盖 330/3731，每批约 300）
3. 六级词表长尾缺口：对照完整六级词表 diff 补词（已两批 +264）
4. 哑词扩词根：剩约 2089 个单块词（其中相当部分是真不可拆的独立词，到顶约 60% 可拆率）
5. 全库词源审计 + buildMorphemes 恒真条件 bug：短词根（min/ment/par/equ/grat/sol）历史误拆清查；修 bug 会改变存量拆解，必须与审计配套做
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

**统计：共 16 项未完成（原 13 + 词源宇宙 4 - 星系图并入词源版图）。其中 1 项高风险（跨机未提交代码）、词源宇宙 4 项为当前主线、5 项近期开发、3 项候选、3 项远期。**
已完成不再列出：五波改造（破译力/先猜后揭/拼词工坊/扫荡/派生带学/词根贪心/形近辨析/家族化复习/词库 3731/多义项）详见 [[redesign-plan-2026-06]]。
