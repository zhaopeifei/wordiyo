/**
 * Tag display configuration: priority, labels, colors, grouping.
 *
 * Colors follow an importance gradient:
 *   - NGSL (green spectrum): most fundamental vocabulary
 *   - IELTS/TOEFL (warm spectrum): international exams
 *   - GRE (purple): advanced academic
 *   - Chinese exams (blue spectrum): locale-specific
 */

type TagGroup = 'intl' | 'cn';

interface TagConfig {
  priority: number;
  label: { en: string; zh: string };
  color: string; // Tailwind classes: bg + text for light & dark
  group: TagGroup;
}

const TAG_CONFIG: Record<string, TagConfig> = {
  'ngsl-1000': {
    priority: 1,
    label: { en: 'NGSL 1k', zh: 'NGSL 1k' },
    color: 'bg-emerald-500/80 text-white dark:bg-emerald-600/70 dark:text-emerald-100',
    group: 'intl',
  },
  'ngsl-2000': {
    priority: 2,
    label: { en: 'NGSL 2k', zh: 'NGSL 2k' },
    color: 'bg-teal-500/80 text-white dark:bg-teal-600/70 dark:text-teal-100',
    group: 'intl',
  },
  'ngsl-3000': {
    priority: 3,
    label: { en: 'NGSL 3k', zh: 'NGSL 3k' },
    color: 'bg-cyan-500/80 text-white dark:bg-cyan-600/70 dark:text-cyan-100',
    group: 'intl',
  },
  'ielts': {
    priority: 4,
    label: { en: 'IELTS', zh: 'IELTS' },
    color: 'bg-amber-500/80 text-white dark:bg-amber-600/70 dark:text-amber-100',
    group: 'intl',
  },
  'toefl': {
    priority: 5,
    label: { en: 'TOEFL', zh: 'TOEFL' },
    color: 'bg-orange-500/80 text-white dark:bg-orange-600/70 dark:text-orange-100',
    group: 'intl',
  },
  'gre': {
    priority: 6,
    label: { en: 'GRE', zh: 'GRE' },
    color: 'bg-purple-500/80 text-white dark:bg-purple-600/70 dark:text-purple-100',
    group: 'intl',
  },
  'zk': {
    priority: 7,
    label: { en: 'Zhongkao', zh: '中考' },
    color: 'bg-sky-500/80 text-white dark:bg-sky-600/70 dark:text-sky-100',
    group: 'cn',
  },
  'gk': {
    priority: 8,
    label: { en: 'Gaokao', zh: '高考' },
    color: 'bg-blue-500/80 text-white dark:bg-blue-600/70 dark:text-blue-100',
    group: 'cn',
  },
  'cet4': {
    priority: 9,
    label: { en: 'CET-4', zh: '四级' },
    color: 'bg-indigo-500/80 text-white dark:bg-indigo-600/70 dark:text-indigo-100',
    group: 'cn',
  },
  'cet6': {
    priority: 10,
    label: { en: 'CET-6', zh: '六级' },
    color: 'bg-violet-500/80 text-white dark:bg-violet-600/70 dark:text-violet-100',
    group: 'cn',
  },
  'ky': {
    priority: 11,
    label: { en: 'Kaoyan', zh: '考研' },
    color: 'bg-rose-500/80 text-white dark:bg-rose-600/70 dark:text-rose-100',
    group: 'cn',
  },
};

export interface ResolvedTag {
  slug: string;
  label: string;
  color: string;
}

/** Sort tags by priority and resolve display info. */
function resolveTags(slugs: string[], locale: string): ResolvedTag[] {
  return slugs
    .filter((s) => s in TAG_CONFIG)
    .sort((a, b) => TAG_CONFIG[a].priority - TAG_CONFIG[b].priority)
    .map((slug) => {
      const cfg = TAG_CONFIG[slug];
      return {
        slug,
        label: cfg.label[locale as 'en' | 'zh'] ?? cfg.label.en,
        color: cfg.color,
      };
    });
}

/**
 * For word cards: return top N tags, sorted by priority.
 * locale='en' hides Chinese exam tags.
 */
export function getCardTags(slugs: string[], locale: string, max = 3): ResolvedTag[] {
  const filtered = locale === 'en'
    ? slugs.filter((s) => TAG_CONFIG[s]?.group !== 'cn')
    : slugs;
  return resolveTags(filtered, locale).slice(0, max);
}

/**
 * For detail pages: return all tags in one sorted list.
 * locale='en' hides Chinese exam tags.
 */
export function getDetailTags(slugs: string[], locale: string): ResolvedTag[] {
  const filtered = locale === 'en'
    ? slugs.filter((s) => TAG_CONFIG[s]?.group !== 'cn')
    : slugs;
  return resolveTags(filtered, locale);
}
