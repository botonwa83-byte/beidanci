---
name: freemium-model
description: WordPulse 背单词 App 的免费下载+买断解锁商业化方案与决策
metadata: 
  node_type: memory
  type: project
  originSessionId: 2e628016-9a21-41c8-b571-f7f307b59497
---

App 从付费下载改为「免费下载 + 买断解锁完整版」(freemium)。用户已确定的决策：

- **平台**：仅 iOS App Store → 用 Apple 内购，`react-native-iap`。
- **定价模式**：纯买断（非订阅）= Apple **非消耗型内购**。价格 **¥12**。
- **Product ID**：`com.botonwa83.wordpulse.lifetime`（= Bundle ID `com.botonwa83.wordpulse` + `.lifetime` 后缀；App Store Connect 建内购时必须填一模一样）。
- **依赖已装好**：react-native-iap 12.16.4（JS+Pod 都已 link），node 经 brew 装在 /opt/homebrew（v26），CocoaPods 1.16.2 经 brew 装。
- **会员绑定**：绑 Apple ID，换机靠「恢复购买」，与本地手机号登录无关。当前纯客户端校验（无服务端验收据），起步够用，后期防破解再加服务端。

**免费/付费切法**（每天差一点不够用 → 转化）：
- 学习：第 1 关(~50词)免费，其余锁
- 猜词(卖点)：每天 5 次免费，超出弹 Paywall（0 点重置）
- 复习：基础可用，完整记忆曲线锁
- 语法：试看前 3 条
- 词库：可浏览，词根拆解/例句/联想故事锁

**已完成（地基）**：`src/data/entitlementService.ts`、`src/data/useEntitlement.tsx`(EntitlementProvider+useEntitlement)、`src/screens/PaywallScreen.tsx`、App.tsx 接入 Provider+Paywall 模态路由、ProfileScreen 会员入口。
**待办（门禁阶段）**：在各 Tab 功能触发点用 `isPremium` 加门禁；猜词每日次数计数模块。
**用户需手动跑**：`npm install` + `cd ios && pod install`（本会话取不到 node/npm）。
