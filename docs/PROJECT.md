# Wordiyo 项目文档

> 项目核心参考文档，记录愿景、平台模块、方法论、架构和发展规划。
> 最后更新：2026-03-18

---

## 目录

1. [愿景与定位](#1-愿景与定位)
2. [平台模块总览](#2-平台模块总览)
3. [教学方法论](#3-教学方法论)
4. [数据架构](#4-数据架构)
5. [技术架构](#5-技术架构)
6. [多语言策略](#6-多语言策略)
7. [当前状态](#7-当前状态)

---

## 1. 愿景与定位

### 1.1 核心愿景

**Wordiyo**（/wɜːr.ˈdiː.jəʊ/）是一个面向全球英语学习者的**全方位英语学习平台**。

学习英语词汇的方式有很多：查释义、背列表、读文章、学词根……但这些方式分散在不同工具中，缺乏有机整合。Wordiyo 的目标是将这些方式**融合在一个平台上**，让学习者能够：

- **查** — 查询任何一个单词的完整信息：释义、发音、搭配、例句、词素拆解
- **背** — 按考试（雅思/托福/GRE）、频率（NGSL）、主题场景等维度浏览词汇列表
- **学** — 通过词根词源系统性地理解构词逻辑，"理解一个词根，掌握一族单词"
- **读** — 阅读精选英文文章，遇到生词即时查看含义，在语境中巩固词汇
- **练** — 通过 Flashcard、Quiz 等互动方式从"认识"走向"掌握"
- **记** — 个人词汇本追踪学习进度，从陌生到熟练可视化呈现

项目的核心信念：**词汇学习不应该是枯燥的死记硬背，而应该是有逻辑、有语境、有反馈的系统性过程。**

### 1.2 目标用户

面向**所有英语学习者**，不限语言背景：

- 备考学生（四六级、雅思、托福、GRE、SAT、高考、考研等）
- 自主提升词汇量的职场人士
- 对词源学感兴趣的语言爱好者
- 英语教师和教育工作者

### 1.3 核心价值

| 价值 | 说明 |
|------|------|
| **词根驱动** | 以词根为核心组织知识网络，揭示构词逻辑而非死记硬背 |
| **全面覆盖** | 查词、列表、词根、阅读、练习、个人追踪——一站式学习体验 |
| **多语言友好** | 所有内容以"英文 + 用户母语"双语呈现，当前支持中文，规划覆盖日语、西班牙语、葡语等 |
| **内容质量** | 15,000+ 单词配有专业释义、IPA 音标、高频搭配、双语例句（英文 + 母语）、词素分解 |
| **SEO 优先** | SSR/ISR 架构，让搜索引擎成为用户发现词汇知识的入口 |
| **开放免费** | 核心内容对所有人开放 |

### 1.4 与其他产品的差异

Wordiyo 不是又一个"背单词 App"，也不是一个纯词典。它的独特之处在于：

- **词源可视化**：每个单词都可分解为彩色编码的词素（前缀 + 词根 + 后缀），让构词逻辑一目了然
- **多维度融合**：查词、列表、词根学习、阅读、练习不是孤立的功能，而是通过单词相互串联——词根页链接到单词，文章中的生词链接到单词详情，单词详情中的搭配和例句帮助理解语境
- **学习闭环**：从"发现"（搜索/浏览）→"理解"（释义/词源/语境）→"练习"（卡片/测验）→"追踪"（mastery/词汇本），形成完整的学习路径

---

## 2. 平台模块总览

平台围绕"查、背、学、读、练、记"六大学习行为，组织为以下模块：

### 2.1 词汇查询（Dictionary）

> 查询任何一个单词的全面信息

每个单词详情页 `/word/[slug]` 包含：

- **释义**：按词性分组的双语释义（英文在上，母语翻译在下）
- **发音**：UK/US IPA 音标 + TTS 朗读
- **词素分解**：彩色编码的前缀/词根/后缀可视化，每个词素可点击跳转
- **搭配**：高频搭配短语（如 make a decision），附带母语翻译和朗读
- **例句**：地道双语例句（英文 + 母语翻译），附带朗读
- **考试标签**：IELTS / TOEFL / CET-4 / GRE 等标记
- **词频信息**：CEFR 等级、Collins 星级、Oxford 3000 标记、频率排名
- **构词说明**：词源类型（词根派生 / 原生词 / 外来词 / 混合词等）
- **相关词汇**：同义词、反义词、同族词

每个词根详情页 `/root/[slug]` 包含：

- 词根含义、拼写变体、来源语言
- 词源故事（如 "Latin agere → to do, to drive"）
- Grimm's Law 语音变化分组
- 语义域分类
- 所有关联单词列表（可按考试标签筛选）
- 相关词根推荐

### 2.2 词汇列表（Word Lists）

> 按不同维度组织的词汇集合

通过 `/explore` 入口，提供多种维度的词汇列表：

**按考试分类：**
- IELTS / TOEFL / GRE / CET-4 / CET-6 / 高考 / 考研 / 中考

**按频率分类：**
- NGSL 1000（最高频 1000 词）
- NGSL 2000（次高频 1000 词）
- NGSL 3000（第三梯队 1000 词）
- AWL（学术词汇表）

**按词根分类：**
- 所有词根浏览、拉丁语词根、希腊语词根、最高产词根

**按主题/场景分类（规划中）：**
- 旅游、商务、日常对话、学术写作、科技、医学等场景词汇
- 基于现有 45+ 语义域（body、food、mind、movement 等）的词汇浏览

列表中的每个单词都可点击查看完整详情，登录用户可标记掌握程度。

### 2.3 词根学习（Root-Based Learning）

> 平台的核心特色——通过词根系统性理解构词逻辑

这是 Wordiyo 区别于其他词汇工具的核心模块：

- **605 个词根**：覆盖英语中高频的拉丁语和希腊语词根
- **词素分解可视化**：每个单词都被拆解为彩色编码的词素，直观展示构词逻辑
- **词根关联网络**：相关词根互相链接，形成可探索的知识图谱
- **Grimm's Law 语音规律**：帮助理解同源词根的不同拼写形式（如 act/ag, scrib/script）
- **语义域浏览**：按主题（生命、时间、运动、思维…）探索词根

### 2.4 文章阅读（Articles）

> 在真实语境中学习和巩固词汇

平台提供两类文章：

**Learn 学习文章** `/learn`：
- 词根专题讲解（如 "10 个最有用的拉丁词根"）
- 语音变化规律（如 "Grimm's Law 完全指南"）
- 构词法教程、词汇学习策略等

**Read 精选阅读** `/read`：
- 精选英文经典文章（演讲、科普、随笔等）
- **词汇标注**：文章中的关键词自动高亮，点击可查看释义
- **词汇卡片**：文章末尾汇总所有标注词汇
- **侧边词汇栏**：阅读时随时查看已标注词汇列表

文章共有特性：
- 双语翻译切换（英文原文 / 母语译文全文对照）
- TTS 朗读
- 阅读进度条
- 目录侧边栏导航

### 2.5 互动练习（Practice）— 规划中

> 从"认识"到"掌握"的主动学习

- **Flashcard 记忆卡片**：基于间隔重复算法，高效记忆
- **词汇测验 Quiz**：选择题、填空题、拼写测试
- **每日挑战**：每天推送少量新词，降低学习压力
- **词根猜词**：给出词根组合，猜测单词含义

### 2.6 个人中心（My Vocabulary）

> 追踪学习进度，管理个人词汇

- **用户登录**：Google OAuth 一键登录
- **Mastery 追踪**：每个单词/词根标记为 4 个掌握等级（陌生 → 见过 → 熟悉 → 掌握）
- **我的词汇本** `/vocabulary`：查看所有标记过的词汇和词根，按掌握程度筛选
- **学习统计**：各等级词汇数量可视化

### 2.7 AI 能力（规划中）

> 利用 AI 提升学习体验

- **AI 词汇助手**：对任何单词提出问题，获得词源解释、用法辨析、记忆技巧等
- **智能推荐**：根据用户学习进度和薄弱点推荐下一步学习内容
- **AI 生成例句**：根据用户水平生成难度匹配的例句
- **语境理解**：在阅读文章时，AI 解释单词在当前语境中的具体含义

### 2.8 模块间的串联

各模块并非孤立存在，而是通过**单词**这一核心实体串联：

```
词根页 ──关联单词──→ 单词详情页 ←──词汇标注── 阅读文章
  ↑                    ↓    ↑                     ↑
语义域             Mastery 标记              学习文章引用
  ↓                    ↓
主题词汇列表        我的词汇本 → Flashcard / Quiz
  ↑                    ↓
考试/频率列表      学习统计 → AI 推荐
```

用户可以从任何入口进入——搜索一个单词、浏览一个词根、阅读一篇文章——然后自然地在模块间流转，形成完整的学习闭环。

---

## 3. 教学方法论

### 3.1 词根驱动学习 (Root-Driven Learning)

核心方法：从词根出发，串联一族单词。

```
词根 duct（引导）
├── con + duct → conduct（引导在一起 → 指挥/行为）
├── pro + duct → product（向前引导 → 产品）
├── intro + duct + ion → introduction（引导进入 → 介绍）
└── de + duct → deduct（向下引导 → 扣除）
```

学习者掌握一个词根后，遇到含有该词根的陌生单词时，可以通过词素分解推断含义。

### 3.2 词素分解可视化 (Morpheme Decomposition)

每个单词被分解为有视觉区分的词素：

| 词素类型 | 作用 |
|----------|------|
| **词根** (root) | 单词的核心语义 |
| **前缀** (prefix) | 修饰方向、否定、程度等 |
| **后缀** (suffix) | 决定词性（名词/动词/形容词） |
| **连接符** (connector) | 连接音节，无实际语义 |

各类型词素通过不同样式区分（具体视觉规范见 DESIGN-GUIDE.md）。每个词素都可以点击，跳转到对应的词根详情页，实现知识网络的自然探索。

### 3.3 Grimm's Law 语音变化规律

**格里姆定律**帮助学习者理解为什么同源词根会有不同的拼写形式。

项目中整理的六种语音变化模式：

| 模式 | 说明 | 示例 |
|------|------|------|
| **元音交替** | 元音在词根变体间切换 | man/min/men, cap/cep/cip |
| **辅音清浊交替** | 清辅音 ↔ 浊辅音 | b/p/f/v, d/t/s/z, g/k/c/q |
| **鼻音替换** | m/n/ng 互换 | sim/syn, com/con |
| **流音交替** | l/r 互换 | alter/other |
| **H 脱落** | 词根变体中 h 消失 | herb/erb |
| **字母换位** | 字母顺序调换 | aks/ask |

理解这些规律后，学习者能识别出表面上不同的拼写其实是同一个词根的变体（如 `act/ag`、`scrib/script`）。

### 3.4 语义域分类 (Semantic Domains)

每个词根被标记了所属的语义域（如 life、time、movement、action 等，共 45+ 个类别）。这使得学习者可以按主题探索相关词根，而非仅靠字母顺序。

### 3.5 语境学习 (Contextual Learning)

通过阅读文章中的词汇标注，学习者在真实语境中接触生词。研究表明，在语境中学习的词汇比孤立记忆的词汇保留率更高。文章中的每个标注词汇都链接到完整的单词详情，让学习者可以随时深入了解。

### 3.6 间隔重复（规划中）

Flashcard 和 Quiz 模块将采用间隔重复算法（Spaced Repetition），根据用户的记忆曲线自动调整复习频率，实现高效长期记忆。

---

## 4. 数据架构

### 4.1 核心数据类型

```
RootEntry (词根)
  ├── WordEntry (单词) ─── 通过 root_words 多对多关联
  ├── AffixEntry (词缀) ─── 通过 MorphemeSegment 关联
  └── MorphemeSegment (词素) ─── 单词的构成单元
```

#### RootEntry（词根）

词根是整个数据模型的中心节点。

| 字段 | 类型 | 说明 |
|------|------|------|
| `slug` | string | 唯一标识，如 `"act"`, `"bio"` |
| `variants` | string[] | 拼写变体，如 `["act", "ag"]` |
| `meaning` | Record\<Locale, string\> | 核心含义（多语言） |
| `languageOfOrigin` | enum | 来源语言（Latin, Greek, PIE 等） |
| `etymology` | string | 词源追溯，如 `"Greek βίος"` |
| `overview` | Record\<Locale, string\> | 详细说明（多语言） |
| `originSummary` | Record\<Locale, string\> | 词源故事（多语言） |
| `semanticDomains` | SemanticDomain[] | 语义域分类 |
| `relatedRoots` | string[] | 相关词根 slug |
| `associatedWords` | string[] | 关联单词 slug |
| `grimmLawGroup` | string? | Grimm's Law 分组，如 `"b/p/f/v"` |

#### WordEntry（单词）

| 字段 | 类型 | 说明 |
|------|------|------|
| `slug` | string | 唯一标识 |
| `lemma` | string | 单词原形 |
| `partOfSpeech` | string[] | 词性 |
| `pronunciation` | { uk, us } | 英美音标 (IPA) |
| `definition` | Record\<Locale, string\> | 释义（多语言） |
| `senses` | Array\<{pos, definition}\> | 按词性分组的释义 |
| `examples` | Array\<Record\<Locale, string\>\> | 例句（多语言） |
| `collocations` | Array\<Record\<Locale, string\>\> | 高频搭配短语（英文 + 母语翻译） |
| `rootBreakdown` | MorphemeSegment[] | 词素分解 |
| `morphologyNote` | Record\<Locale, string\> | 构词说明 |
| `etymologyType` | enum | 词源类型（root-derived, native, loanword 等） |
| `relatedWords` | string[] | 相关单词 |
| `frequency` | enum? | CEFR 频率等级 |
| `frequencyRank` | number? | 词频排名 |
| `tags` | string[]? | 考试标签（CET-4, IELTS 等） |

#### AffixEntry（词缀）

| 字段 | 类型 | 说明 |
|------|------|------|
| `slug` | string | 唯一标识 |
| `form` | string | 显示形式，如 `"pre-"`, `"-tion"` |
| `type` | enum | `prefix` 或 `suffix` |
| `meaning` | Record\<Locale, string\> | 含义（多语言） |
| `examples` | string[] | 示例单词 |

#### MorphemeSegment（词素）

单词分解的最小单元，用于可视化展示。

| 字段 | 类型 | 说明 |
|------|------|------|
| `surface` | string | 表面形式，如 `"bio"`, `"-logy"` |
| `type` | enum | `root` / `prefix` / `suffix` / `connector` |
| `rootSlug` | string? | 关联词根（可点击跳转） |
| `affixSlug` | string? | 关联词缀 |

### 4.2 数据库表结构

| 表 | 说明 |
|------|------|
| `roots` | 词根（605 条），含语义域、格林法则分组 |
| `words` | 单词（~16,000 条），含 CEFR、Collins 星级、Oxford 标记、词频排名 |
| `affixes` | 词缀（163 条） |
| `morpheme_segments` | 词素分解 |
| `word_senses` | 按词性分组的释义（英文 + 多语言翻译） |
| `word_examples` | 双语例句（英文 + 母语翻译，69,150 条） |
| `tags` / `word_tags` | 考试标签（CET-4/6、TOEFL、IELTS、GRE、高考、考研、中考等） |
| `root_words` | 词根-单词多对多关联 |
| `word_relations` / `root_relations` | 同义/反义关系 |
| `user_mastery` | 用户掌握程度追踪（user_id, item_type, slug, status） |

---

## 5. 技术架构

### 5.1 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **框架** | Next.js 15 | App Router + SSR/ISR on Vercel |
| **UI** | React 19 | Server Components + Client Components |
| **数据库** | Supabase (PostgreSQL) | 词汇数据 + 用户数据唯一数据源 |
| **认证** | Supabase Auth | Google OAuth |
| **语言** | TypeScript (strict) | 类型安全 |
| **样式** | Tailwind CSS 4.0 | CSS-first 配置，设计令牌驱动 |
| **组件** | Radix UI | 无障碍原语组件 |
| **文章** | MDX | Learn / Read 文章内容 |
| **主题** | next-themes | Light/Dark 模式 |
| **字体** | Lora + Nunito | 衬线标题 + 无衬线正文 |
| **包管理** | pnpm | 高效依赖管理 |

### 5.2 架构原则

**SEO 优先，SSR/ISR**

- 部署在 Vercel，使用 Next.js SSR/ISR 模式
- ISR 缓存 1 小时（`revalidate = 3600`）
- ~16,000 个单词页 + 605 个词根页 + 163 个词缀页，搜索引擎可直接抓取

**结构化数据**

每个页面都嵌入 JSON-LD 结构化数据：
- 单词/词根页：`DefinedTerm`
- 词汇列表页：`CollectionPage`
- 文章页：`Article`
- 全站面包屑：`BreadcrumbList`

### 5.3 路由结构

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | Hero、数据统计、特色词根、词素分解示例 |
| `/about` | 关于 | 愿景、方法论 |
| `/root` | 词根列表 | 浏览所有词根（支持排序） |
| `/root/[slug]` | 词根详情 | 词源、关联单词、相关词根 |
| `/word/[slug]` | 单词详情 | 释义、发音、拆解、搭配、例句 |
| `/explore` | 词汇列表入口 | 所有 collection 按类别展示 |
| `/explore/[slug]` | 列表详情 | 具体 collection 的词汇/词根列表 |
| `/learn` | 学习文章列表 | 词根讲解、构词法、语音规律 |
| `/learn/[slug]` | 学习文章详情 | MDX 渲染 + 目录侧边栏 |
| `/read` | 阅读文章列表 | 精选英文阅读 |
| `/read/[slug]` | 阅读文章详情 | 词汇标注 + 侧边词汇栏 + 词汇卡片 |
| `/vocabulary` | 我的词汇本 | 个人 mastery 追踪（需登录） |
| `@drawer/(.)word/[slug]` | 单词抽屉 | 点击单词时的侧边详情弹出 |

### 5.4 组件架构

```
app/layout.tsx          ← 根布局（字体、主题、全局结构）
  ├── providers.tsx     ← ThemeProvider + LanguageProvider + AuthProvider
  ├── site-header.tsx   ← 全局导航（Logo、搜索、导航链接、用户头像、语言/主题切换）
  ├── [page]/           ← 页面级组件（co-located 模式）
  └── site-footer.tsx   ← 全局页脚

components/ui/          ← 基础 UI 组件（Button、Table、Tooltip）
content/articles/       ← MDX 文章内容（learn/ + read/）
lib/db/                 ← Supabase 数据访问层
lib/i18n/               ← 国际化字典
types/content.ts        ← TypeScript 类型定义
```

### 5.5 SEO 策略

| 策略 | 实现 |
|------|------|
| SSR/ISR | Vercel Serverless + 1 小时 ISR 缓存 |
| 动态 metadata | `generateMetadata()` 为每个页面生成 title/description |
| Open Graph | 每个页面都有 OG + Twitter Card 标签 |
| 结构化数据 | JSON-LD（DefinedTerm / CollectionPage / Article / BreadcrumbList） |
| Sitemap | `sitemap.ts` 动态生成 ~15,000+ URL |
| Robots | 允许所有爬虫 |
| 语言声明 | HTML lang 属性 + hreflang alternates |

---

## 6. 多语言策略

### 6.1 当前状态

- **已支持**：English (en)、中文 (zh)
- **切换方式**：客户端即时切换，无页面刷新
- **实现**：React Context (`LanguageProvider`) + `useLanguage()` Hook

### 6.2 多语言模式

平台采用**"英文 + 用户母语"双语并呈**的模式：

- 英文始终是基础语言（学习对象）
- 用户选择的母语作为辅助翻译语言
- 释义、例句、搭配、文章译文等内容均以"英文 + 母语"呈现

数据层使用 `Record<Locale, string>` 存储多语言文本：

```typescript
// 数据层：英文 + 各语言翻译
meaning: { en: "do, act, drive", zh: "干/做/动", ja: "する/行動する", es: "hacer/actuar" }

// UI 层：界面翻译字典
const dictionaries = {
  en: { tagline: "Discover the roots of English", ... },
  zh: { tagline: "探索英语的词根", ... },
  ja: { tagline: "英語の語根を探る", ... },
}
```

文章内容通过 MDX 中的 `<Trans>` 组件实现段落级双语切换（英文原文 / 母语译文）。

### 6.3 扩展规划

**目标**：覆盖全球主要英语学习者群体。

规划支持的语言（按优先级排序）：

| 语言 | Locale | 覆盖用户群 |
|------|--------|------------|
| English | `en` | ✅ 已支持 |
| 中文 | `zh` | ✅ 已支持 |
| 日本語 | `ja` | 日本英语学习者 |
| Español | `es` | 西班牙语国家学习者 |
| Português | `pt` | 巴西/葡萄牙学习者 |
| 한국어 | `ko` | 韩国学习者 |
| 更多语言 | ... | 根据用户需求扩展 |

当前架构（`Record<Locale, string>`）天然支持多语言扩展，添加新语言只需在数据中补充对应 locale 的值。

---

## 7. 当前状态

### 7.1 数据规模

| 指标 | 数量 |
|------|------|
| 词根 (Roots) | 605 个 |
| 单词 (Words) | ~16,000 个 |
| 词缀 (Affixes) | 163 个 |
| 例句 | 69,150 条（英文 + 中文翻译，后续扩展更多语言） |
| 有搭配的单词 | 9,816 个 |
| 语义域 | 45+ 个类别 |
| 考试标签 | 10 种（CET-4/6、TOEFL、IELTS、GRE、GMAT、SAT、TOEIC、高考、考研、中考） |
| 词汇列表 | 14 个 collection |
| 文章 | 4 篇（2 learn + 2 read） |

### 7.2 功能完成度

| 模块 | 状态 | 说明 |
|------|------|------|
| 词汇查询 | ✅ 完整 | 单词详情页、词根详情页、词素分解可视化、IPA + TTS |
| 词汇列表 | ✅ 基础完成 | 14 个 collection（考试/频率/词根），缺主题场景维度 |
| 词根学习 | ✅ 完整 | 124 词根、词素可视化、可点击跳转、Grimm's Law |
| 文章阅读 | ⚠️ 基础设施完善 | MDX + 翻译切换 + 词汇标注 + TTS，但内容量少（4 篇） |
| 互动练习 | ❌ 未开始 | Flashcard / Quiz / 每日挑战 |
| 个人中心 | ✅ 基础完成 | Google 登录、Mastery 追踪、词汇本页面 |
| AI 能力 | ❌ 未开始 | AI 助手、智能推荐等 |
| 搜索 | ✅ 完整 | 混合搜索：词根/词缀客户端即时搜索，单词通过 API 查询 Supabase（16,000+） |

### 7.3 已完成功能清单

- [x] 词根浏览列表页（网格视图 + 色彩轮转 + 排序）
- [x] 词根详情页（词源、语义域、关联单词表、相关词根）
- [x] 单词详情页（发音 IPA + TTS、释义、词素分解、搭配、例句）
- [x] 词素视觉区分 + 可点击跳转
- [x] 词汇列表 Explore（14 个 collection，4 个分类）
- [x] Learn 学习文章（MDX + 翻译切换 + 目录 + TTS）
- [x] Read 阅读文章（词汇标注 + 侧边词汇栏 + 词汇卡片）
- [x] Google OAuth 登录
- [x] Mastery 追踪（4 级：陌生/见过/熟悉/掌握）
- [x] 我的词汇本（按掌握程度筛选，词汇/词根两个 Tab）
- [x] 单词抽屉（Intercepting Route，侧边弹出详情）
- [x] 多语言切换（当前中英，架构支持扩展更多语言）
- [x] Light/Dark 主题切换
- [x] 响应式设计（移动端 → 桌面端）
- [x] SEO 全套（sitemap、robots、JSON-LD、OG tags、结构化数据）

---

## 附录：项目结构速查

```
english-word-roots/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局
│   ├── globals.css         # 全局样式 + CSS 变量
│   ├── providers.tsx       # Theme + Language + Auth Provider
│   ├── page.tsx            # 首页
│   ├── about/              # 关于页
│   ├── root/               # 词根列表 + 详情
│   ├── word/[slug]/        # 单词详情页
│   ├── explore/            # 词汇列表入口 + 详情
│   ├── learn/              # 学习文章列表 + 详情
│   ├── read/               # 阅读文章列表 + 详情
│   ├── vocabulary/         # 我的词汇本
│   ├── @drawer/            # 单词抽屉（Parallel Route）
│   └── api/                # API Routes（词汇批量查询、单词搜索、OAuth 回调）
├── components/             # 复用组件
│   ├── ui/                 # 基础 UI 组件
│   ├── site-header.tsx     # 全局导航
│   └── site-footer.tsx     # 全局页脚
├── content/                # 内容
│   ├── articles/           # MDX 文章（learn/ + read/）
│   ├── roots.ts            # 词根搜索数据（需通过 sync-content 生成）
│   ├── affixes.ts          # 词缀搜索数据（需通过 sync-content 生成）
│   ├── collections.ts      # 词汇列表定义
│   └── site.ts             # 站点配置（品牌名、URL、导航）
├── lib/                    # 工具函数
│   ├── db/                 # Supabase 数据访问层
│   ├── supabase.ts         # Supabase 客户端
│   └── i18n/               # 国际化字典
├── supabase/               # 数据库
│   ├── schema.sql          # 表结构定义
│   └── seed-data/          # 种子数据 JSON
├── types/                  # TypeScript 类型定义
├── scripts/                # 数据导入/丰富化脚本
├── docs/                   # 项目文档
│   ├── PROJECT.md          # 本文档
│   ├── STYLE-GUIDE.md      # 样式设计规范
│   └── DEVELOPMENT.md      # 开发指南
└── public/                 # 静态资源
```
