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

**最终门禁（仅 3 处，复习/词库经用户决定不加门禁、保持免费）**：
- **猜词(卖点)**：非会员每天 5 次免费破译，超出弹 Paywall（0 点按本地日期重置）→ `src/data/guessQuota.ts` + GuessWordScreen「破译答案」处
- **学习**：非会员学满第 1 级「入门」(=levels[0].targetWords=140 词)即拦截，弹 Paywall；复习走独立 Tab 不受影响 → LearnScreen startSession
- **语法**：非会员仅试看全表前 3 条，点其余条目弹 Paywall、卡片显示🔒 → GrammarScreen
- 复习：❌ 不加门禁（用户决定，全免费）
- 词库/WordDetail：❌ 不加门禁（用户决定，全免费）

**已完成**：地基(`entitlementService.ts`/`useEntitlement.tsx`/`PaywallScreen.tsx`/App.tsx 接入/ProfileScreen 入口) + 上述 3 处门禁 + `guessQuota.ts`。全项目 tsc 0 错误。真机沙盒购买/恢复已验证通过。
**测试**：原 `__tests__/App.test.tsx` 失败（既有问题，非内购引起）已修复——新增 `jest.setup.js`（mock safe-area-context/keychain/iap）+ 改用 `await act` 异步渲染并 unmount + fake timers。jest 通过、tsc 0 错误。
**未提交**：功能代码尚未 git commit（仅 claude-memory 同步过 GitHub）。
**依赖已装**：react-native-iap 12.16.4（JS+Pod link 完成）。
