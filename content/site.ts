export const SITE_NAME = 'Wordiyo';
export const SITE_URL = 'https://wordiyo.com';
export const SITE_DESCRIPTION =
  'Learn English vocabulary through word roots and etymology. Bilingual explanations, morpheme breakdowns, and curated word lists.';
export const SUPPORTED_LANGUAGES = ['en', 'zh'] as const;

export type Locale = (typeof SUPPORTED_LANGUAGES)[number];

export type LocalePreference = Locale | 'auto';

export const DEFAULT_LOCALE: Locale = 'en';

export interface NavLink {
  href: string;
  label: Record<Locale, string>;
  /** When true, the header renders a dropdown menu for this item. */
  hasDropdown?: boolean;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/explore', label: { en: 'Word Lists', zh: '词库' }, hasDropdown: true },
  { href: '/learn', label: { en: 'Learn', zh: '学习' }, hasDropdown: true },
  { href: '/vocabulary', label: { en: 'My Words', zh: '词汇本' } },
];

/** Flat link list for the footer (all leaf pages). */
export const FOOTER_NAV_LINKS: NavLink[] = [
  { href: '/explore', label: { en: 'Word Lists', zh: '词库' } },
  { href: '/root', label: { en: 'Roots', zh: '词根' } },
  { href: '/learn', label: { en: 'Guides', zh: '指南' } },
  { href: '/read', label: { en: 'Read', zh: '阅读' } },
  { href: '/vocabulary', label: { en: 'My Words', zh: '词汇本' } },
];
