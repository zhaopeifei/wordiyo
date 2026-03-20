'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { RiArrowDownSLine, RiArrowRightSLine, RiMenuLine, RiSearchLine, RiCloseLine, RiNodeTree, RiBookOpenLine, RiArticleLine, RiListCheck2 } from '@remixicon/react';
import { NAV_LINKS, SITE_NAME } from '@/content/site';
import type { NavLink } from '@/content/site';
import type { Locale } from '@/content/site';
import { COLLECTION_CATEGORIES, getCollectionsByCategory } from '@/content/collections';
import { CollectionIcon } from '@/components/collection-icon';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/components/auth-provider';
import { CommandSearch } from '@/components/command-search';
import { RiLoginBoxLine, RiLogoutBoxLine, RiUserLine } from '@remixicon/react';

// ---------------------------------------------------------------------------
// Dropdown menu data
// ---------------------------------------------------------------------------

const DROPDOWN_SLUGS = ['ielts', 'toefl', 'gre', 'ngsl-1000', 'ngsl-2000', 'ngsl-3000'];

interface DropdownSection {
  label: Record<Locale, string>;
  items: { href: string; icon: React.ReactNode; label: Record<Locale, string> }[];
}

interface DropdownConfig {
  sections: DropdownSection[];
  footer?: { href: string; label: Record<Locale, string> };
}

const EXPLORE_SECTIONS: DropdownSection[] = COLLECTION_CATEGORIES
  .map((cat) => ({
    label: cat.label,
    items: getCollectionsByCategory(cat.key)
      .filter((c) => DROPDOWN_SLUGS.includes(c.slug))
      .map((c) => ({
        href: `/explore/${c.slug}`,
        icon: <CollectionIcon icon={c.icon} />,
        label: c.name,
      })),
  }))
  .filter((s) => s.items.length > 0);

const LEARN_SECTIONS: DropdownSection[] = [
  {
    label: { en: '', zh: '' },
    items: [
      { href: '/root', icon: <RiNodeTree className="h-5 w-5" />, label: { en: 'Roots', zh: '词根' } },
      { href: '/learn', icon: <RiBookOpenLine className="h-5 w-5" />, label: { en: 'Guides', zh: '指南' } },
      { href: '/read', icon: <RiArticleLine className="h-5 w-5" />, label: { en: 'Read', zh: '阅读' } },
    ],
  },
];

const DROPDOWN_CONFIGS: Record<string, DropdownConfig> = {
  '/explore': {
    sections: EXPLORE_SECTIONS,
    footer: { href: '/explore', label: { en: 'All Collections', zh: '全部集合' } },
  },
  '/learn': {
    sections: LEARN_SECTIONS,
  },
};

// ---------------------------------------------------------------------------
// Desktop dropdown component
// ---------------------------------------------------------------------------

const DesktopDropdown = ({
  link,
  locale,
  config,
}: {
  link: NavLink;
  locale: Locale;
  config: DropdownConfig;
}) => {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleEnter = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const handleLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link
        href={link.href}
        className="text-muted-foreground hover:text-primary flex items-center gap-1 rounded-full px-5 py-2.5 text-sm font-bold transition-colors"
      >
        {link.label[locale]}
        <RiArrowDownSLine
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </Link>

      {open && (
        <div className="border-border bg-card absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border py-2 shadow-lg">
          {config.sections.map((section, si) => (
            <div key={section.label.en || `s${si}`}>
              {si > 0 && <div className="mx-3 my-1" />}
              <div className={section.label[locale] ? 'px-3 pt-2 pb-1' : ''}>
                {section.label[locale] && (
                  <span className="text-muted-foreground/60 text-[11px] font-semibold uppercase tracking-wider">
                    {section.label[locale]}
                  </span>
                )}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:bg-muted hover:text-primary flex items-center gap-2.5 px-3 py-2 text-sm transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span className="w-5 text-center">{item.icon}</span>
                  {item.label[locale]}
                </Link>
              ))}
            </div>
          ))}
          {config.footer && (
            <Link
              href={config.footer.href}
              className="text-foreground hover:bg-muted hover:text-primary mt-2 flex items-center gap-2.5 px-3 py-2 text-sm transition-colors"
              onClick={() => setOpen(false)}
            >
              <RiListCheck2 className="h-5 w-5" />
              {config.footer.label[locale]}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Mobile submenu for dropdown nav items
// ---------------------------------------------------------------------------

const MobileSubmenu = ({
  link,
  locale,
  config,
  onNavigate,
}: {
  link: NavLink;
  locale: Locale;
  config: DropdownConfig;
  onNavigate: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={link.href}
          className="text-foreground hover:text-primary flex-1 rounded-xl py-3 px-3 text-base font-bold transition-colors"
          onClick={onNavigate}
        >
          {link.label[locale]}
        </Link>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-muted-foreground hover:text-primary flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-colors"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <RiArrowDownSLine
            className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {expanded && (
        <div className="pb-2 pl-3">
          {config.sections.map((section, si) => (
            <div key={section.label.en || `s${si}`}>
              {section.label[locale] && (
                <span className="text-muted-foreground block px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider">
                  {section.label[locale]}
                </span>
              )}
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-foreground hover:text-primary flex items-center gap-2 rounded-lg py-2 px-3 text-sm transition-colors"
                  onClick={onNavigate}
                >
                  <span className="w-5 text-center">{item.icon}</span>
                  {item.label[locale]}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// User menu (login / avatar)
// ---------------------------------------------------------------------------

const UserMenu = ({ variant = 'icon' }: { variant?: 'icon' | 'full' }) => {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (loading) return null;

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => signInWithGoogle()}
        className={
          variant === 'full'
            ? 'text-foreground hover:text-primary flex items-center gap-2 rounded-xl py-3 px-3 text-base font-bold transition-colors'
            : 'bg-primary hover:bg-primary/90 flex h-9 cursor-pointer items-center rounded-full px-4 text-sm font-medium text-primary-foreground transition-colors'
        }
      >
        {locale === 'zh' ? '登录' : 'Login'}
      </button>
    );
  }

  const avatar = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name ?? user.email;

  if (variant === 'full') {
    return (
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          {avatar ? (
            <img src={avatar} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              <RiUserLine className="h-4 w-4" />
            </div>
          )}
          <span className="text-foreground text-sm font-medium truncate max-w-[140px]">{name}</span>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="text-muted-foreground hover:text-foreground cursor-pointer rounded-full p-2 transition-colors"
          title={locale === 'zh' ? '退出登录' : 'Sign out'}
        >
          <RiLogoutBoxLine className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors overflow-hidden border border-border hover:border-primary"
      >
        {avatar ? (
          <img src={avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <RiUserLine className="text-muted-foreground h-4 w-4" />
        )}
      </button>
      {open && (
        <div className="border-border bg-card absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-xl border shadow-lg">
          <div className="border-border border-b px-3 py-2">
            <p className="text-foreground text-sm font-medium truncate">{name}</p>
            <p className="text-muted-foreground text-xs truncate">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => { signOut(); setOpen(false); }}
            className="text-foreground hover:bg-muted flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors cursor-pointer"
          >
            <RiLogoutBoxLine className="h-4 w-4" />
            {locale === 'zh' ? '退出登录' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// SiteHeader
// ---------------------------------------------------------------------------

export const SiteHeader = () => {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll to toggle backdrop blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // init
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on pathname change (link navigation)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile panel is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  // Cmd/Ctrl+K to toggle search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/60 backdrop-blur-2xl backdrop-saturate-150' : ''}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-heading text-primary flex items-center gap-1.5 text-xl font-bold"
            aria-label={SITE_NAME}
          >
            <Image src="/logo-transparent.png" alt="" width={28} height={28} className="h-7 w-7" />
            Wordiyo
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {NAV_LINKS.map((link) =>
              link.hasDropdown && DROPDOWN_CONFIGS[link.href] ? (
                <DesktopDropdown key={link.href} link={link} locale={locale} config={DROPDOWN_CONFIGS[link.href]} />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary rounded-full px-5 py-2.5 text-sm font-bold transition-colors"
                >
                  {link.label[locale]}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop controls (hidden on mobile) */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground hover:text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
              aria-label="Search"
            >
              <RiSearchLine className="h-4 w-4" />
            </button>
            <LanguageSwitcher />
            <ThemeToggle />
            <UserMenu />
          </div>

          {/* Mobile hamburger button (visible on mobile only) */}
          <button
            type="button"
            className="text-muted-foreground hover:text-primary flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-colors md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <RiMenuLine className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile slide-out panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* Slide-out panel */}
          <nav className="border-border bg-background absolute bottom-0 right-0 top-0 flex w-72 flex-col border-l-[1.5px]">
            {/* Panel header: logo + close button */}
            <div className="border-border flex items-center justify-between border-b-[1.5px] px-4 py-3">
              <Link
                href="/"
                className="font-heading text-primary flex items-center gap-1.5 text-xl font-bold"
                onClick={closeMobile}
              >
                <Image src="/logo-transparent.png" alt="" width={28} height={28} className="h-7 w-7" />
                Wordiyo
              </Link>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl transition-colors"
                onClick={closeMobile}
                aria-label="Close navigation menu"
              >
                <RiCloseLine className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
              {NAV_LINKS.map((link) =>
                link.hasDropdown && DROPDOWN_CONFIGS[link.href] ? (
                  <MobileSubmenu
                    key={link.href}
                    link={link}
                    locale={locale}
                    config={DROPDOWN_CONFIGS[link.href]}
                    onNavigate={closeMobile}
                  />
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-foreground hover:text-primary block rounded-xl py-3 px-3 text-base font-bold transition-colors"
                    onClick={closeMobile}
                  >
                    {link.label[locale]}
                  </Link>
                ),
              )}
            </div>

            {/* User info (mobile) */}
            <div className="border-border mx-4 border-t-[1.5px]" />
            <UserMenu variant="full" />

            {/* Divider */}
            <div className="border-border mx-4 border-t-[1.5px]" />

            {/* Controls: search + language switcher + theme toggle */}
            <div className="flex items-center gap-3 px-4 py-4">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="border-border bg-background text-muted-foreground hover:border-primary hover:text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition-colors"
                aria-label="Search"
              >
                <RiSearchLine className="h-4 w-4" />
              </button>
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}

      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
