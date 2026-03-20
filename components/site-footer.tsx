'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SITE_NAME } from '@/content/site';
import { useLanguage } from '@/components/language-provider';
import type { Locale } from '@/content/site';

interface FooterColumn {
  title: Record<Locale, string>;
  links: { href: string; label: Record<Locale, string> }[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: { en: 'Explore', zh: '探索' },
    links: [
      { href: '/explore', label: { en: 'Word Lists', zh: '词库' } },
      { href: '/root', label: { en: 'Roots', zh: '词根' } },
      { href: '/vocabulary', label: { en: 'My Words', zh: '词汇本' } },
    ],
  },
  {
    title: { en: 'Learn', zh: '学习' },
    links: [
      { href: '/learn', label: { en: 'Guides', zh: '指南' } },
      { href: '/read', label: { en: 'Read', zh: '阅读' } },
    ],
  },
  {
    title: { en: 'Company', zh: '关于' },
    links: [
      { href: '/about', label: { en: 'About Us', zh: '关于我们' } },
      { href: '/terms', label: { en: 'Terms of Service', zh: '服务条款' } },
      { href: '/privacy', label: { en: 'Privacy Policy', zh: '隐私政策' } },
    ],
  },
];

export const SiteFooter = () => {
  const { locale } = useLanguage();

  return (
    <footer className="bg-muted">
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        {/* Top: Logo left + Columns right */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Left: Brand */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="font-heading text-foreground flex items-center gap-1.5 text-xl font-bold"
            >
              <Image src="/logo-transparent.png" alt="" width={28} height={28} className="h-7 w-7" />
              Wordiyo
            </Link>
            <p className="text-muted-foreground text-sm max-w-[260px]">
              {locale === 'zh'
                ? '通过词根词源，系统性构建英语词汇体系。'
                : 'Build your English vocabulary systematically through word roots and etymology.'}
            </p>
          </div>

          {/* Right: Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-14">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title.en} className="flex flex-col gap-3">
                <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  {col.title[locale]}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary text-sm transition-colors"
                      >
                        {link.label[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Copyright only, left-aligned */}
        <p className="text-muted-foreground/60 mt-12 text-sm">
          © {new Date().getFullYear()} {SITE_NAME}.
        </p>
      </div>
    </footer>
  );
};
