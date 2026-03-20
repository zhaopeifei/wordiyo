# Wordiyo

面向全球英语学习者的全方位英语学习平台。融合查词、词汇列表、词根词源、阅读、练习和词汇本，让词汇学习成为有逻辑、有语境、有反馈的系统性过程。

- **线上地址**：https://wordiyo.com

## 文档索引

| 文档 | 用途 |
|------|------|
| [docs/PROJECT.md](docs/PROJECT.md) | 项目愿景、教学方法论、数据架构、技术架构、路线图 |
| [docs/DESIGN-GUIDE.md](docs/DESIGN-GUIDE.md) | 设计理念、颜色体系、排版规范、组件模式、禁止模式 |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | 开发约定、部署基础设施、环境变量、构建命令、故障排除 |

## 核心约束

- 品牌名：**Wordiyo**
- 域名：`wordiyo.com`
- SSR/ISR 部署于 Vercel，数据源为 Supabase（PostgreSQL）
- TypeScript strict 模式，所有代码必须通过类型检查
- 多语言 UI 同步：中英文内容必须同步维护
- 包管理器：**pnpm**
- **不要自动 `pnpm build`**，用 `pnpm type-check` 验证类型
- 样式只用语义化 CSS 变量，禁止硬编码颜色值
- 开发约定详见 [DEVELOPMENT.md](docs/DEVELOPMENT.md)
