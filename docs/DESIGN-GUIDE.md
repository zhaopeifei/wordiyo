# Wordiyo 设计规范

> 所有新增页面和组件必须遵循本文档。
> 核心理念：**灰度优先 → 系统约束 → 强调弱化 → 充分留白 = 专业设计**

---

## 目录

0. [设计理念 (Design Philosophy)](#0-设计理念-design-philosophy)
1. [设计令牌 (Design Tokens)](#1-设计令牌-design-tokens)
2. [色彩系统 (Color System)](#2-色彩系统-color-system)
3. [字体排版 (Typography)](#3-字体排版-typography)
4. [间距与形状 (Spacing & Shape)](#4-间距与形状-spacing--shape)
5. [组件规范 (Component Patterns)](#5-组件规范-component-patterns)
6. [交互状态管理 (Loading, Error & Optimistic Updates)](#6-交互状态管理-loading-error--optimistic-updates)
7. [动画模式 (Animation Patterns)](#7-动画模式-animation-patterns)
8. [响应式设计 (Responsive Design)](#8-响应式设计-responsive-design)
9. [暗色模式 (Dark Mode)](#9-暗色模式-dark-mode)
10. [禁止模式 (Prohibited Patterns)](#10-禁止模式-prohibited-patterns)

---

## 0. 设计理念 (Design Philosophy)

基于 Refactoring UI 方法论，以下 8 条原则指导本项目所有设计决策：

1. **层级优先** — 用户一眼能分清什么重要什么不重要，通过字重、颜色深浅和大小的组合来表达，而不是单靠放大
2. **弱化而非强化** — 要突出某个元素，优先把周围的东西压下去，而不是把它自己推上去
3. **系统约束** — 间距、字号、颜色都从预定义的有限集合中选取，不做临时决定
4. **灰度基底** — 设计的骨架完全由黑白灰承载，颜色只作为强调手段叠加上去
5. **用空间代替装饰** — 留白、间距、背景色差异就能划分区域和关系，边框和线条是最后的手段
6. **深度即语义** — 阴影不是装饰，是在告诉用户这个东西离你有多近、有多重要
7. **操作有主次** — 一个界面只有一个最重要的动作，其他动作必须在视觉上退后
8. **功能先于容器** — 先把单个功能设计好，再考虑它放在什么布局里

---

## 1. 设计令牌 (Design Tokens)

所有颜色通过 CSS 变量定义，在 `app/globals.css` 中管理。组件只能使用语义化 Tailwind 类名引用这些变量，**禁止硬编码颜色值**。

### 1.1 核心语义变量

| 变量 | 用途 | Light 值 | Dark 值 |
|------|------|----------|---------|
| `--background` | 页面背景 | `#fefdf6` (暖白) | `#0f1a0a` (深绿黑) |
| `--foreground` | 主要文字 | `#1a2e05` (深绿) | `#e8eade` (浅米) |
| `--primary` | 品牌主色/CTA | `#16a34a` (绿) | `#10b981` (emerald-500) |
| `--primary-foreground` | 主色上的文字 | `#ffffff` | `#022c22` |
| `--secondary` | 保留（shadcn/ui 兼容） | `#d97706` (琥珀橙) | `#d97706` (amber-600) |
| `--accent` | 保留（shadcn/ui 兼容） | `#8b5cf6` (紫) | `#8b5cf6` (violet-500) |
| `--muted` | 次要背景 / 卡片 hover | `#f5f5f0` | `#1a2414` |
| `--muted-foreground` | 次要文字 | `#6b7280` | `#94a38a` |
| `--card` | 卡片背景（仅暗色模式需要） | `#f0fdf4` | `#1a2e12` |
| `--card-foreground` | 卡片文字 | `#1a2e05` | `#e8eade` |
| `--border` | 边框 | `#e5e2d9` (暖灰) | `#2d3a24` |
| `--input` | 输入框边框 | `#e5e2d9` | `#2d3a24` |
| `--ring` | 焦点环 | `#16a34a` | `#10b981` |
| `--destructive` | 危险/错误 | `#ef4444` | `#dc2626` |

### 1.2 文字颜色层级

信息层级通过 3 级灰度文字表达，而非通过颜色：

| 层级 | 变量/类 | 用途 | 示例 |
|------|---------|------|------|
| **主要** | `text-foreground` | 标题、关键信息 | 页面标题、卡片名称 |
| **次要** | `text-muted-foreground` | 辅助说明、标签 | 释义、日期、描述文字 |
| **最弱** | `text-muted-foreground/60` | 极弱提示、占位符 | placeholder、footer 文字 |

> **原则**：层级通过字重 + 灰度深浅组合表达，不靠放大字号或添加颜色。

### 1.3 图表变量 (Chart Colors)

| 变量 | Light 值 | Dark 值 |
|------|----------|---------|
| `--chart-1` | `#16a34a` (绿) | `#22c55e` |
| `--chart-2` | `#d97706` (橙) | `#f59e0b` |
| `--chart-3` | `#8b5cf6` (紫) | `#a78bfa` |
| `--chart-4` | `#06b6d4` (青) | `#22d3ee` |
| `--chart-5` | `#ec4899` (粉) | `#f472b6` |

### 1.4 Tailwind @theme 映射

在 `globals.css` 的 `@theme inline {}` 块中注册变量到 Tailwind 类名：

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --font-heading: var(--font-lora);
  --font-body: var(--font-nunito);
}
```

> **注意**：本项目使用 **Tailwind CSS v4**（CSS-first 配置），使用 `@import 'tailwindcss'` + `@theme {}` 语法。

---

## 2. 色彩系统 (Color System)

### 2.1 单色品牌体系

**绿色是唯一的品牌色**。日常组件开发中，只使用 `--primary` 作为强调色。

| 角色 | 颜色 | 使用场景 |
|------|------|----------|
| **品牌色** | 绿 `--primary` | CTA 按钮、链接 hover、焦点环、active 状态、词根标签 |

> **关键约束**：`--secondary` 和 `--accent` 保留在 CSS 变量中供 shadcn/ui 兼容，但不主动用于页面 UI。

### 2.2 灰度基底原则

页面的视觉骨架完全由黑白灰承载：

```
背景：--background（暖白）
内容区/hover：--muted（灰白）
边框：--border（暖灰）
主文字：--foreground（深色）
次文字：--muted-foreground（中灰）
```

颜色（`--primary`）只在以下场景出现：
- CTA 按钮填充
- 链接文字 hover 状态
- 焦点环 (focus ring)
- 词根标签（`.morpheme-root`）
- Active / Selected 状态指示

### 2.3 词素类型样式 (Morpheme Type Styles)

双层级设计：词根用品牌色实底（唯一的彩色元素），其余全部退为灰色。用户通过位置和文字标注区分 prefix / suffix。

| 类型 | 样式 | 说明 |
|------|------|------|
| 词根 `.morpheme-root` | `bg-primary text-white` 实底 | 唯一醒目的彩色元素 |
| 前缀 / 后缀 / 连接符 | `border border-border text-muted-foreground` 灰色描边 | 统一低调，不区分颜色 |

### 2.4 标签样式 (Tag & Pill Styles)

语义域标签、语源标签等分类信息统一使用中性 pill 样式（`rounded-full bg-muted text-muted-foreground`），靠文字内容本身传达语义，不靠颜色区分。

### 2.5 允许使用的 Tailwind 颜色类

**设计令牌类**（日常组件开发）：

```
bg-background, text-foreground, text-muted-foreground
bg-primary, text-primary, border-primary
bg-muted, border-border
bg-destructive, text-destructive
```

---

## 3. 字体排版 (Typography)

### 3.1 字体家族

| 角色 | 字体 | CSS 变量 | Tailwind 类 | 说明 |
|------|------|----------|-------------|------|
| 标题 | **Lora** | `--font-lora` → `--font-heading` | `font-heading` | 衬线体，学术优雅感 |
| 正文 | **Nunito** | `--font-nunito` → `--font-body` | `font-body` | 无衬线体，友好易读 |

字体在 `app/layout.tsx` 中通过 `next/font/google` 加载，自动添加 `display: swap`。

### 3.2 全局字体规则

```css
/* globals.css @layer base */
body {
  @apply bg-background text-foreground font-body;
}
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading), serif;
}
```

### 3.3 响应式字号层级

遵循移动端优先的递进式字号：

| 元素 | 手机 (base) | 平板 (md:) | 桌面 (lg:) | 字重 |
|------|-------------|------------|------------|------|
| h1 | `text-2xl` | `text-3xl` | `text-4xl` / `text-5xl` | `font-bold` |
| h2 | `text-xl` | `text-2xl` | `text-3xl` | `font-bold` |
| h3 | `text-lg` | `text-xl` | — | `font-semibold` |
| 正文 | `text-base` (16px) | — | — | `font-normal` |
| 辅助文字 | `text-sm` (14px) | — | — | — |

> **最小字号**：正文不得小于 14px (`text-sm`)，避免在移动端阅读困难。

### 3.4 行高

| 场景 | 行高 | 说明 |
|------|------|------|
| 标题 | `leading-tight` (1.25) | 紧凑，标题短不需要太松 |
| 正文 | `leading-relaxed` (1.625) | 宽松，长文本便于阅读追踪 |
| UI 文字 | `leading-normal` (1.5) | 按钮、标签等短文字 |

---

## 4. 间距与形状 (Spacing & Shape)

### 4.1 圆角系统

直接使用 Tailwind 默认的 `rounded-*` 类，不需要自定义 CSS 变量：

| 类名 | 值 | 用途 |
|------|-----|------|
| `rounded-md` | 6px | 小按钮、标签、输入框 |
| `rounded-lg` | 8px | 中等组件 |
| `rounded-xl` | 12px | 卡片、弹出面板 |
| `rounded-2xl` | 16px | 大面积区域、Hero 卡片 |
| `rounded-full` | 9999px | 胶囊按钮、头像、pill 标签 |

### 4.2 边框规范

默认粗细 1px（`border`），保持轻盈。能用间距或背景色差异分隔的，不用边框。

### 4.3 留白与呼吸感

| 场景 | 类名 | 说明 |
|------|------|------|
| 页面容器 | `mx-auto w-full max-w-5xl px-4 py-10` | 内容不铺满，留出边距 |
| 大区块间距 | `py-12 px-4` → `md:py-20` → `lg:py-28` | Section 之间充分留白 |
| 卡片内边距 | `p-5` 或 `p-6` | 内容不贴边 |
| 卡片网格间距 | `gap-6` 或 `gap-8` | 卡片之间透气 |
| 紧凑列表 | `gap-2` 或 `gap-3` | 关联性强的项目间距小 |

> **原则**：宁可空间多一点也不要拥挤。留白 = 呼吸感 = 高级感。

### 4.4 背景装饰

```css
/* 点阵背景，可选的全局装饰 */
.bg-dots {
  background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px);
  background-size: 32px 32px;
}
```

使用时透明度要极低（`opacity-[0.08]` ~ `opacity-10`），装饰不能喧宾夺主。

---

## 5. 组件规范 (Component Patterns)

### 5.1 Header

- **始终透明背景**，滚动后仅加 `backdrop-blur-xl` 模糊
- 无 border-b，无 shadow，无背景色
- Nav 内部用间距分组，减少线条分隔

### 5.2 卡片

默认安静，hover 才显现。统一样式，无色彩轮转。

| 状态 | 背景 | 边框 | 阴影 |
|------|------|------|------|
| 默认 | 透明 | `border border-border` | 无 |
| Hover | `bg-muted` | 不变 | `shadow-md` + `-translate-y-1` |
| 暗色模式 | `bg-card` | 不变 | 无 |

### 5.3 Button

一个界面只有一个 Primary 按钮，其他操作视觉上退后。

| 变体 | 用途 |
|------|------|
| `default` (bg-primary) | 主要操作，每个视图最多 1 个 |
| `outline` | 次要操作 |
| `ghost` | 内联操作 |
| `link` | 文本链接 |
| `destructive` | 危险操作 |

### 5.4 Icon Button

Icon 保持小尺寸 (`h-4 w-4`)，外层 padding (`p-2.5`) 撑大触控区域至 44px。Ghost 风格，无 border，hover 靠颜色变化反馈。

### 5.5 Footer

- `border-t border-border`（1px）分隔
- 链接之间用 `gap` 间距分组，不用竖线分隔符

### 5.6 交互状态

| 状态 | 处理方式 |
|------|----------|
| Hover 卡片 | `hover:bg-muted hover:-translate-y-1 hover:shadow-md` |
| Hover 链接 | `hover:text-primary` |
| Focus | `focus-visible:ring-1 focus-visible:ring-ring` |
| Disabled | `disabled:pointer-events-none disabled:opacity-50` |
| 过渡 | `transition-all duration-200` |

### 5.7 其他约定

- 禁止原生 `<select>`，使用 `CustomSelect` 组件
- 类名合并使用 `cn()` 函数（`lib/utils.ts`）

---

## 6. 交互状态管理 (Loading, Error & Optimistic Updates)

### 6.1 加载状态 (Loading States)

- **核心页面**（词根详情、单词详情、词汇本）必须使用**骨架屏**：`animate-pulse` + `bg-muted` 圆角矩形，形状与真实内容匹配，模拟自然的文本长短不一
- **非核心页面**（筛选、搜索等）不强制骨架屏，简单 spinner 即可
- 核心路由应提供 Next.js `loading.tsx` 返回骨架屏

### 6.2 错误状态 (Error States)

错误状态必须融入设计系统，不能是裸文本或浏览器默认样式：

- 页面级错误保持正常页面的留白（`py-20 px-4`），必须提供恢复手段（重试按钮 / 返回链接）
- 错误文字用 `text-destructive`，语气简洁中性
- 核心路由应提供 Next.js `error.tsx`

### 6.3 空状态 (Empty States)

列表/搜索无结果时，必须有足够留白（最少 `py-12`）+ `text-muted-foreground` 居中文字，不能裸文字。

### 6.4 乐观更新 (Optimistic Updates)

用户标记/收藏/掌握度等轻量写操作，采用乐观更新——立即切换 UI 状态，后台异步同步，失败时静默回滚并用 toast 告知。

- 乐观操作**不展示 loading spinner**，点击即切换
- 状态切换加 `transition-colors duration-200` 过渡
- 失败用 toast 或内联 `text-destructive`，不弹 alert
- 请求 pending 期间 `pointer-events-none` 防连续触发

### 6.5 布局稳定性 (Layout Stability)

功能元素（操作按钮、标记图标等）的位置必须固定，不因可选内容的有无而偏移。可选区域为空时，通过 `min-h` 或占位保持空间，确保同类操作区域在不同卡片间始终对齐。

---

## 7. 动画模式 (Animation Patterns)

本项目以 CSS transition 为主，复杂场景可引入 `motion/react`。

### 7.1 基础规则

- 时长范围：`0.2s – 0.6s`
- 只动画 `opacity` 和 `transform`（y, scale, rotate）
- 滚动动画必须 `once: true`（只播放一次）
- Stagger 延迟：`0.08 – 0.12s`
- 交互动画用 spring 物理，入场动画用 `easeOut`

### 7.2 常用动画模式

#### ScrollFadeIn — 滚动渐入

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {children}
</motion.div>
```

#### StaggerGrid — 交错入场

```tsx
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
```

### 7.3 动画引入规则

使用 `motion/react`（Motion v12+），**禁止** `framer-motion`。

---

## 8. 响应式设计 (Responsive Design)

### 8.1 断点系统

| 尺寸 | 宽度 | Tailwind 前缀 | 典型设备 |
|------|------|---------------|----------|
| 手机 | < 640px | (base，无前缀) | iPhone 竖屏 |
| 大手机 | 640–767px | `sm:` | iPhone 横屏 |
| 平板 | 768–1023px | `md:` | iPad 竖屏 |
| 桌面 | ≥ 1024px | `lg:` | 笔记本/桌面 |

**核心原则**：无前缀的类 = 手机样式，逐级用 `sm:` / `md:` / `lg:` 添加大屏样式。

### 8.2 常用响应式模式

| 模式 | 手机 (base) | 平板 (md:) | 桌面 (lg:) |
|------|-------------|------------|------------|
| 网格列数 | `grid-cols-1` | `md:grid-cols-2` | `lg:grid-cols-3` |
| Flex 方向 | `flex-col` | `md:flex-row` | — |
| 导航 | hamburger (`md:hidden`) | 横排 (`hidden md:flex`) | — |
| 标题字号 | `text-2xl` | `md:text-3xl` | `lg:text-5xl` |
| 区块内边距 | `py-12 px-4` | `md:py-20` | `lg:py-28` |

### 8.3 触控目标

所有可点击元素最小触控区域 44×44px（参见 §5.4 Icon Button）。

### 8.4 图片响应式

- 图片使用 `w-full max-w-full h-auto`
- 折叠线以下的图片：`loading="lazy"`；Hero 图片不加 lazy

---

## 9. 暗色模式 (Dark Mode)

### 9.1 实现方式

- **CSS 变量覆盖**：`.dark {}` 块覆盖 `:root {}` 中的所有变量
- **主题切换**：`next-themes` 库管理（在 `app/providers.tsx` 中配置）
- **持久化**：`localStorage` 存储用户选择
- **默认值**：跟随系统偏好（`prefers-color-scheme`）

### 9.2 颜色推导规则

| 类型 | Light → Dark 规则 |
|------|-------------------|
| 结构色（background, muted, border） | 反转明暗，保持冷暖一致 |
| 品牌色（primary） | 微调亮度以保证对比度 ≥ 4.5:1 |
| 文字色（foreground, muted-foreground） | 反转为浅色，永远不用纯白 `#ffffff` |

本项目的特殊处理：
- 背景色保持 **暖绿色调**：Light `#fefdf6` → Dark `#0f1a0a`
- 品牌绿色柔化为青绿：`#16a34a` → `#10b981` (emerald-500)
- 暗色模式卡片需要 `bg-card` 背景以保证辨识度（light 模式卡片可以透明）

### 9.3 编码规则

1. `.dark {}` **必须在** `:root {}` **之后**（CSS 级联顺序决定覆盖）
2. `.dark {}` 必须覆盖全部变量
3. **不使用** Tailwind `dark:` 前缀做颜色切换（通过 CSS 变量自动适配）
4. SVG/图标使用 `currentColor`
5. 渐变使用 `from-background to-muted`，不硬编码颜色

**例外**：语义域标签等分类颜色可以使用 `dark:` 前缀，因为它们使用 Tailwind 色板而非设计令牌。

---

## 10. 禁止模式 (Prohibited Patterns)

> 以下是**容易犯错的高频禁令**，各节已阐述的规则不再重复。

| 禁止 | 正确做法 | 相关章节 |
|------|----------|----------|
| `bg-white` / `bg-black` / `bg-gray-*` / 硬编码 `#hex` | 只用语义令牌类（`bg-background`、`bg-muted` 等） | §1, §2 |
| `@apply` 中用 `/opacity` | 在 JSX className 中用（`bg-primary/10`） | §1 |
| `import from "framer-motion"` | `import from "motion/react"` | §7 |
| 原生 `<select>` | 使用 `CustomSelect` 组件 | §5 |
| `max-[breakpoint]:` 模式 | 移动端优先 + `sm:` / `md:` / `lg:` | §8 |
| 组件中用 `dark:` 切换令牌颜色 | CSS 变量自动适配（语义域标签例外） | §9 |
