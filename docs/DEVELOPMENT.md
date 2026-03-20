# 开发指南

> 项目开发约定、基础设施配置、构建命令、故障排除。

---

## 环境变量

```
NEXT_PUBLIC_SUPABASE_URL=...         # Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...    # Supabase anon key（前端/SSR 使用）
SUPABASE_SERVICE_ROLE_KEY=...        # 仅脚本使用（绕过 RLS）
```

---

## 开发约定

### 数据

- **唯一数据源**：Supabase 数据库，通过 `lib/db/` 模块访问
- **数据访问层**：`lib/db/`（roots.ts / words.ts / affixes.ts / mappers.ts）
- **静态内容**：`content/` 目录存放站点配置和文章内容
- **站点配置**：`content/site.ts` 仍为静态导入（品牌名、URL、导航等）

### 样式

- 只用语义化 CSS 变量，禁止硬编码颜色值（`bg-white` / `#hex`）
- 动画库用 `motion/react`，禁止 `framer-motion`
- 语素配色：root = 绿色实底 / prefix = 青色描边 / suffix = 紫色描边 / connector = 灰色描边
- 详见 [DESIGN-GUIDE.md](DESIGN-GUIDE.md) 的「禁止模式」章节

### 多语言

- 实现方式：React Context（`LanguageProvider`）+ `useLanguage()` hook
- 可翻译内容类型：`Record<Locale, string>`（`en` / `zh`）
- 新增文案时必须同时提供中英文

---

## 构建与验证

| 命令 | 用途 | 场景 |
|------|------|------|
| `pnpm dev` | 启动开发服务器（支持 HMR） | 日常开发 |
| `pnpm build` | 生产环境构建 | 部署前验证 / CI（仅在用户要求时执行） |
| `pnpm type-check` | TypeScript 类型检查（轻量） | 代码审查 / 提交前 |
| `pnpm lint` | ESLint 代码检查 | 代码审查 / 提交前 |

> **注意**：开发时不要自动运行 `pnpm build`，用户会一直启动 `pnpm dev`。验证类型正确性用 `pnpm type-check`。

### 提交前清单

1. 在 `pnpm dev` 中验证改动
2. 运行 `pnpm type-check` 检查类型
3. 清理缓存（如遇到样式问题）
4. 测试相关页面（详情页、侧边栏等）
5. 验证响应式布局（移动端 / 平板 / 桌面）

---

## 部署与基础设施

### 服务架构

| 服务 | 用途 | 管理入口 |
|------|------|---------|
| **Vercel** | 应用部署（SSR/ISR）+ 主域名托管 | vercel.com (project dashboard) |
| **Supabase** | PostgreSQL 数据库 + 用户认证 | supabase.com → 项目 Dashboard |
| **Cloudflare** | 旧域名 DNS、CDN、静态资源缓存 | dash.cloudflare.com |
| **Google Cloud Console** | OAuth 2.0 凭证管理 | console.cloud.google.com → APIs & Services → Credentials |

### 域名

- **主域名**：`wordiyo.com`（Vercel 购买 & DNS 托管）
- **旧域名**：`www.englishwordroots.com`（Cloudflare DNS，301 跳转到 wordiyo.com）

### 用户认证

使用 **Google OAuth** 登录，通过 Supabase Auth 中转：

```
用户点击登录 → Supabase Auth → Google OAuth → 回调到 Supabase → 跳转回网站
```

涉及两个平台的配置：

**Google Cloud Console**（OAuth 2.0 Client）：
- Authorized JavaScript origins：`https://wordiyo.com`、`http://localhost:3000`
- Authorized redirect URIs：`https://<project>.supabase.co/auth/v1/callback`

**Supabase Dashboard**（Auth → URL Configuration）：
- Site URL：`https://wordiyo.com`
- Redirect URLs：`https://wordiyo.com/**`、`http://localhost:3000/**`

### Cloudflare

两个域名都通过 Cloudflare 管理：
- **`wordiyo.com`**：DNS 代理（Proxied），CDN 缓存、DDoS 防护
- **`englishwordroots.com`**：DNS 代理（Proxied），301 跳转到 wordiyo.com

### 分析与 SEO 平台

| 平台 | 用途 | 备注 |
|------|------|------|
| **Google Search Console** | 搜索表现监控、sitemap 提交、索引管理 | 已添加 `wordiyo.com` property |
| **Google Analytics 4 (GA4)** | 流量分析、用户行为追踪 | 通过 Vercel Analytics 或 GA4 代码接入 |
| **Microsoft Clarity** | 热力图、会话录制、用户体验分析 | 嵌入 Clarity tracking code |

---

## 故障排除

### 修改代码后样式丢失，需要重启 dev 服务器

**原因**：Next.js HMR 在某些情况下无法正确更新 Tailwind CSS 编译缓存。

**解决方案**：

```bash
# 方案 A：完全清理缓存（推荐）
rm -rf .next node_modules/.cache
pnpm dev

# 方案 B：快速重启
# Ctrl+C 后重新 pnpm dev

# 方案 C：只清理 Next.js 缓存
rm -rf .next
```

**预防**：批量修改后再验证；修改 `app/globals.css` 等关键文件后主动重启。
