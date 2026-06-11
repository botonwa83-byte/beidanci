# App 开发通用范式

所有新 App 都必须遵守以下范式。

## 0. 「超能力」卖点范式（核心）

**每个 App 都要给用户一种"超能力"，作为核心卖点。** 用户用了这个 App，就仿佛获得了一种别人没有的能力。这是产品定位的灵魂，不只是功能堆砌。

### 设计要点
- **一句话能说清**：这个 App 给用户什么超能力？（例：WordPulse = "看到生词就能猜出意思"）
- **必须有一个专门的模块来"现场展示/兑现"这个超能力**，而不是只在广告页吹。让用户在使用中亲身体验到"我真的会了"。
- **隐性证明 > 直接说教**：设计"先让用户自己试 → 再揭晓验证"的闭环，让用户自己得出"我有这能力了"的结论。
- **正向反馈钉死卖点**：在揭晓/成功时刻打一句话，把体验和品牌+超能力绑定（例："看，拆开词根你就猜到了 —— 这就是 WordPulse 给你的超能力 ✨"）。
- **数据零新增优先**：兑现超能力的模块尽量复用 App 已有数据，算法精选即可，不手工维护清单、不新建词库。

### 实现范式（最小改动接入一个新 Tab 模块）
1. `src/data/<feature>.ts` — 从现有数据算法精选 + 导出（确定式，模块加载时算一次缓存）
2. `src/screens/<Feature>Screen.tsx` — 照抄 `GrammarScreen` 骨架：`useAppTheme` + `createStyles(colors)` + `useSafeAreaInsets` + `maxWidth: theme.layout.maxContentWidth` 居中
3. `App.tsx` — 加 1 个 import + 1 个 `<Tab.Screen>`
4. `src/components/TabBarIcon.tsx` — `name` 类型加一项 + `emojiMap`/`labelMap` 各加一条

### 参考实现
- WordPulse 超能力 = **"猜词能力"**：`src/screens/GuessWordScreen.tsx` + `src/data/guessWords.ts`
  - 玩法：只给词根词缀含义（不给完整释义）→ 用户心里猜 → 点"揭晓答案" → 翻出单词/音标/中文/联想故事 + 超能力 banner → 自评"猜对了/没猜到"，记录猜中率
  - 选词：从 `allWords` 自动筛 200 个可拆解名词（名词、≥2 词素、长度≥5、高频优先），无需手工清单

---

## 1. 启动广告页（SplashScreen）

每个新 App 首次启动都要展示一个宣传广告页，用户手动点击才能进入主界面。

### 开发者信息
- 名称：King Top
- 头像字母：K
- 身份：独立开发者 / 教育科技探索者
- 版权格式：(c) 20XX King Top. All rights reserved.

### 页面结构（从上到下）
1. **Logo + 品牌名** — App图标（圆角方块，主色背景，首字母白色大字）+ App英文名 + 中文slogan
2. **核心卖点标题** — 一句话概括App价值主张
3. **副标题** — 目标人群/覆盖范围
4. **四大功能亮点卡片** — 每个卡片含图标、标题、一句话描述，带交错淡入动画
5. **数据统计栏** — 3个关键数字，用分隔线隔开
6. **开发者介绍卡片** — 头像(K) + King Top + 身份 + 自我介绍 + "更多教育类应用，敬请期待" + "关注我们，第一时间获取新产品动态"
7. **底部版权** — App名称 + 版本号 + 版权声明
8. **底部固定按钮** — "立即开始学习/使用"（主色，大圆角，阴影）

### 交互规则
- **无自动跳过**，用户自行浏览，点击底部按钮进入
- ScrollView 可滚动查看全部内容
- 每次启动App都展示（showSplash state in App.tsx）
- 广告页与认证数据并行加载，不阻塞启动速度

### 动画
- Logo：spring缩放 + 淡入 + 上移（600ms）
- 功能卡片：从800ms开始，每个间隔200ms交错淡入
- 其余内容：跟随Logo淡入

### 风格
- 文案要"吹的天花乱坠"，充分展示App亮点
- 末尾引导关注开发者，获取更多教育类软件
- 配色跟随App主题，深色模式完整适配

### 参考实现
- WordPulse: `src/screens/SplashScreen.tsx`

---

## 2. iPad 键盘适配范式

所有包含输入框的页面，必须使用以下结构适配 iPad 大键盘：

### 结构
```
KeyboardAvoidingView (behavior="padding")
  └─ ScrollView (keyboardShouldPersistTaps="handled", bounces={false})
       └─ 表单内容
```

### 规则
- **不用 `autoFocus`** — iPad 上避免一进页面就弹出大键盘遮挡内容
- **ScrollView 包裹所有内容** — 键盘弹出时页面可向上滚动，输入框始终可见
- **`keyboardShouldPersistTaps="handled"`** — 点击按钮时不会因键盘收起而打断操作
- **`contentContainerStyle` 用 `flexGrow: 1`** — 内容少时仍能撑满屏幕
- **padding 使用 SafeArea insets** — `paddingTop: insets.top + N`, `paddingBottom: insets.bottom + N`

### 参考实现
- WordPulse: `src/screens/LoginScreen.tsx`
