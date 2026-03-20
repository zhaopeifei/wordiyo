# Wordiyo

Wordiyo (/wɜːr.ˈdiː.jəʊ/) is an SEO-first vocabulary learning web application focused on etymology. The site helps learners build durable vocabulary knowledge by organizing words around their shared roots and visualizing the relationships between roots, derivatives, and semantic families. The application is built with Next.js and Tailwind CSS 4.0, ships as a static export, supports light/dark theming, and offers multilingual UI strings so learners can switch interface languages instantly.

## Highlights

- **SEO-centric architecture** with static rendering, optimized metadata, and search-friendly sitemaps/robots baked in.
- **Etymology-first browsing** that pivots around root catalogues, rich storytelling, and semantic relationships.
- **Vocabulary depth** with root breakdowns, bilingual definitions, usage examples, and popularity indicators.
- **Adaptive theming** via CSS variable design tokens, persistable light/dark themes, and color-contrast safe defaults.
- **Multilingual interface** powered by an in-app language provider for rapid locale switching without extra round-trips.
- **Framework ergonomics** built on Next.js App Router, TypeScript, and Tailwind CSS 4.0 utilities for maintainable UI work.

## Core Pages

- **Home (`/home`):** Hero onboarding, featured roots, trending words, and prominent SEO entry points.
- **Explore (`/explore`):** Filterable static catalog combining every root and word entry with quick search.
- **Root Index (`/root`):** Overview of all available roots, sortable by popularity with language-of-origin context.
- **Root Detail (`/root/[slug]`):** Deep dive into a specific root including origin, related roots, and associated vocabulary.
- **Word Detail (`/word/[slug]`):** Word-level breakdown with root decomposition, bilingual definitions, example sentences, and related words.
- **About (`/about`):** Mission statement, stack overview, editorial guardrails, and credibility signals.

## Data Model Overview

- **Root entry:** `slug`, `variants`, `languageOfOrigin`, `overview` (localized copy), `originSummary` (localized copy), `semanticDomains`, `relatedRoots`, `associatedWords`.
- **Word entry:** `slug`, `lemma`, `definition` (localized copy), `examples` (localized copy, multiple sentences), `rootBreakdown` (structured morpheme segments), `relatedWords`.
- **Content helpers:** Static loaders in `lib/content.ts` expose featured roots, trending words, and static params for SSG.

## SEO Strategy

- Fully static export using `output: 'export'` for predictable CDN-friendly deployments.
- Route-level `generateMetadata`, sitemap, and robots declarations support discovery and sharing.
- Semantic HTML and accessible navigation patterns improve crawlability and Lighthouse scores.
- JSON-first content modules allow future enrichment with origin data, structured data, or CMS integrations.

## Theming & Localization

- Theming uses CSS custom properties bound to Tailwind tokens ensuring seamless light/dark transitions.
- `next-themes` stores user preferences (`system`, `light`, `dark`) without layout flashes.
- `LanguageProvider` exposes dictionaries for instant UI translation toggling (English ↔︎ Chinese by default).
- Translation keys live in `lib/i18n/dictionaries.ts` for easy scaling to more locales and SEO copy variants.

## Technology Stack

- **Framework:** Next.js 14 (App Router, static export, typed metadata helpers).
- **Styling:** Tailwind CSS 4.0 alpha with CSS variable design tokens and utility-first composition.
- **Language tooling:** TypeScript strict mode, ESLint (Next + Tailwind plugins), and Prettier with Tailwind sorting.
- **State & theming:** React Server Components for data shell + client components for theme & language switches.

## Scripts

```bash
pnpm dev         # Start development server
pnpm build       # Build static export
pnpm start       # Serve the production build
pnpm lint        # Run ESLint (includes Tailwind plugin)
pnpm type-check  # Run TypeScript without emitting files
pnpm format      # Format repository with Prettier
pnpm format:check# Verify formatting
```

### Environment Variables

Create a `.env.local` file for optional runtime secrets:

```
NEXT_PUBLIC_ANALYTICS_ID=""
CONTENT_API_URL=""
LANGUAGE_FALLBACK="en"
```

## Project Structure

```
english-word-roots/
├─ app/
│  ├─ about/page.tsx
│  ├─ explore/page.tsx
│  ├─ home/page.tsx
│  ├─ root/[slug]/page.tsx
│  ├─ root/page.tsx
│  ├─ word/[slug]/page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ not-found.tsx
│  ├─ page.tsx               # Redirects to /home
│  ├─ providers.tsx          # Theme + language context providers
│  ├─ robots.ts
│  └─ sitemap.ts
├─ components/               # Shareable UI (hero, toggles, detail views)
├─ content/                  # Static root and word datasets + site metadata
├─ lib/                      # Content helpers and i18n dictionaries
├─ types/                    # Shared TypeScript contracts
├─ package.json              # Scripts, dependencies, tooling config
├─ tailwind.config.ts
├─ postcss.config.mjs
├─ next.config.mjs
└─ tsconfig.json
```

## Accessibility & Performance

- Enforce WCAG AA contrast ratios via shared design tokens and Tailwind utilities.
- Provide keyboard-accessible navigation, focus outlines, and consistent skip targets.
- Prefer static data hydration with client components only where interactivity is required (theme, language, filters).
- Prefetch related root/word routes and lazy-load secondary UI pieces to keep TTI low.

## Roadmap

- Personalized study plans powered by root mastery tracking.
- Spaced repetition reminders via email or push notifications.
- Offline-first mobile experience with PWA enhancements.
- Editorial workflows for curating new roots and verifying etymological data.

## Contributing

1. Fork the repository and create a feature branch.
2. Run `pnpm lint`, `pnpm type-check`, and applicable tests before submitting changes.
3. Open a pull request describing your updates and their SEO implications.

## License

This project is distributed under the MIT License. See `LICENSE` for details.

## Contact

Reach the team via the About page or email `hello@wordiyo.com` for partnerships, data corrections, or collaboration inquiries.
