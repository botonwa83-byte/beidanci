# WordPulse (背单词) 项目记忆

## 项目概况
- React Native iOS app，背单词工具（词根词缀记忆法）
- Bundle ID: com.botonwa83.wordpulse
- 显示名: WordPulse，中文名: 背单词
- 目标: 上架 Apple App Store
- 当前版本: v1.5.0（词库 3731 词，可拆解 44%）
- 商业化: 免费下载+¥12买断（详见 freemium-model.md）

## 技术栈
- React Native 0.72.6 + TypeScript
- React Navigation (bottom tabs + native stack)
- react-native-keychain (iOS Keychain 安全存储)
- AsyncStorage (学习进度存储)
- 无后端，纯离线应用
- iOS deployment target: 16.0
- Hermes 已禁用，使用 JavaScriptCore

## 关键文件路径
- `src/screens/` - LoginScreen, LearnScreen, ReviewScreen, ProfileScreen, RootScreen, WordDetailScreen, PrivacyScreen
- `src/data/authService.ts` - 认证服务（手机号直接登录，支持国际号码）
- `src/data/secureStorage.ts` - Keychain 安全存储封装
- `src/data/wordDatabase.ts` - 词库（从JSON构建，带rootIndex索引优化）
- `src/data/learningLogic.ts` - 学习进度管理
- `src/theme/index.ts` - 主题配置（ThemeProvider + useAppTheme hook，支持深色模式）
- `App.tsx` - 入口，tab 导航配置

## 已完成的修复（全部阶段）
### 阶段一：安全与合规
- 移除SMS验证码，手机号作为本地学习ID直接登录
- PrivacyInfo.xcprivacy 声明手机号收集
- 隐私政策和用户协议页面（PrivacyScreen）
- react-native-keychain 替代 AsyncStorage 存储认证信息，含迁移逻辑

### 阶段二：iPad 适配
- 所有页面添加 maxContentWidth + 居中
- Tab Bar 使用 insets.bottom 适配
- RootScreen 使用 insets.top 适配

### 阶段三：用户体验优化
- 全面无障碍支持（accessibilityLabel/Role/State）
- 错误处理：saveProgress/saveAuth 失败时 throw + Alert 提示
- 词库性能优化：getWordsByRoot 用 Map 索引替代 filter

### 阶段四：国际化
- 支持10个国家/地区手机号（中国大陆/港澳台/美加/英/日/韩/新/马）
- 登录页国家代码选择器（Modal底部弹出）
- 手机号格式验证按国家规则，存储为 +countryCode+number

### UI 美化与深色模式
- 系统自动深色模式：useColorScheme() 检测，ThemeProvider 上下文分发
- 所有屏幕使用 createStyles(colors) 动态样式模式
- 深色模式配色：background #0F1419, surface #1A1F2E, text #E6EDF3
- 新增颜色 token：cardBorder, errorBg, warningBg, footerBorder

### 语法模块
- 独立底部 tab（学习/词库/语法/复习/我的）
- `src/screens/GrammarScreen.tsx` - 独立语法页面
- `src/data/grammarData.ts` - 23条语法规则，3个分类（词形变化/句法结构/用法辨析）
- 手风琴展开UI

### 启动广告页（SplashScreen）
- `src/screens/SplashScreen.tsx` - 每次启动展示，用户点击"立即开始"进入
- 在 App.tsx 中 showSplash 状态控制，优先于登录/主页显示

### 猜词模块 →「词根破译」（app 点睛之笔，核心卖点：猜词超能力）
- 独立底部 tab，6 个：学习/词库/语法/**猜词**/复习/我的（图标 🔮，页面标题"词根破译"）
- 灵魂概念：把背单词变成"密码破译"——词根词缀=密钥碎片，逐块解码拼出真相，每破译一个超能力值+1
- `src/screens/GuessWordScreen.tsx` 交互：
  - 展示完整单词 → **点色块逐个翻开含义**（或"全部展开"）→ 猜中文 → "破译答案" → 自评"我破译了/没猜到"
  - **段位系统**：顶部常驻"超能力值"进度条+段位（学徒→行者→游侠→猎人→大师→宗师）
  - **连击 combo**：连对显示 🔥+升温鼓励语
  - **今日神词**：按日期固定一词，养成每日打开习惯
  - **战绩分享卡**：点段位徽章弹出 Modal（段位/已破译数/最高连击/样板长难词+King Top），
    "分享我的超能力"用 RN 自带 `Share` API 分享文案（**零原生依赖，不触碰 pod/Bitcode**）
  - **🔊 发音**：完整单词旁有朗读按钮，调 `utils/speech.ts`（同 Learn/Detail 页）
- `src/data/guessWords.ts` - **人工精选 196 个长难名词**（独立数据，不依赖主词库）
  - 选词铁律：词根词缀必须"透明"，看完拆解一定猜得出，绝不能让用户猜不到打自己脸
  - 拆解覆盖整词每个字母：segment 类型 prefix/root/suffix/**link(连接字母)**；link 在括号外弱化显示
  - 内置 `__DEV__` 自检：segments 拼接必须 === word（已校验 76/76）
  - **同根词(举一反三)**：`getRelatedWords()` 按 root/prefix 自动索引，揭晓后展示（零额外内容，66/76 有家族）
- `src/data/guessProgress.ts` - AsyncStorage 持久化破译数/最高连击 + 段位 RANKS + getDailyWord + comboCheer
  - key: `@wordpulse/guess_progress_v1`
- 体现"每个App给用户一种超能力"范式，详见 app-patterns.md 第0节
- 待做候选：同根词网状可视化、进阶模式(藏含义只给字母)、战绩卡导出为图片(需 view-shot 原生依赖,暂缓)

## 进行中
- [词源宇宙计划](etymology-universe-plan.md) — **当前主线**：三层词源体系("没有一个单词是凭空来的")；A 身世卡已完成(307条故事)，下一步 B 今日冷知识
- [待办任务清单](pending-tasks.md) — 未完成任务清单（高风险跨机内购项已 2026-06-11 解决）
- [反平庸改造计划](redesign-plan-2026-06.md) — 五波已完成并推送：破译力/先猜后揭/拼词工坊/扫荡/派生带学/多义项；星系图与撤语法tab待做
- [Freemium 商业化方案](freemium-model.md) — 免费下载+¥12买断，3处门禁(猜词/学习/语法)，代码已合并进 master（待推送）

## 通用开发范式
详见 [app-patterns.md](./app-patterns.md)
- **超能力卖点**：每个App给用户一种超能力，配一个专属模块现场兑现（WordPulse=猜词能力）
- 启动广告页：每个App必须有，King Top 开发者介绍
- iPad键盘适配：KeyboardAvoidingView + ScrollView，不用 autoFocus

## 注意事项
- 仅支持 iOS 平台
- 未来计划加 Apple 登录(B方案) + iCloud 同步(C方案)
- 开发者名称：King Top
