'use client';

import { useCallback } from 'react';
import { RiCircleLine, RiStarLine, RiStarHalfLine, RiStarFill } from '@remixicon/react';
import { useAuth } from '@/components/auth-provider';
import { useMastery, type MasteryStatus, type ItemType } from '@/components/mastery-provider';
import { useLanguage } from '@/components/language-provider';
import { cn } from '@/lib/utils';

const STATUSES: {
  value: MasteryStatus;
  icon: React.ComponentType<{ className?: string }>;
  label: Record<string, string>;
  idle: string;
  active: string;
}[] = [
  {
    value: 'unknown',
    icon: RiCircleLine,
    label: { en: 'Unknown', zh: '不认识' },
    idle: 'opacity-40 hover:opacity-80 hover:scale-110',
    active: 'opacity-100 scale-110',
  },
  {
    value: 'seen',
    icon: RiStarLine,
    label: { en: 'Seen', zh: '见过' },
    idle: 'opacity-40 hover:opacity-80 hover:scale-110',
    active: 'opacity-100 scale-110',
  },
  {
    value: 'familiar',
    icon: RiStarHalfLine,
    label: { en: 'Familiar', zh: '熟悉' },
    idle: 'opacity-40 hover:opacity-80 hover:scale-110',
    active: 'opacity-100 scale-110',
  },
  {
    value: 'mastered',
    icon: RiStarFill,
    label: { en: 'Mastered', zh: '掌握' },
    idle: 'opacity-40 hover:opacity-80 hover:scale-110',
    active: 'opacity-100 scale-110',
  },
];

interface MasteryButtonsProps {
  type: ItemType;
  slug: string;
  /** Show text labels next to emoji */
  showLabels?: boolean;
  className?: string;
}

export function MasteryButtons({ type, slug, showLabels = false, className }: MasteryButtonsProps) {
  const { user, signInWithGoogle } = useAuth();
  const { getStatus, setStatus, clearStatus } = useMastery();
  const { locale } = useLanguage();
  const currentStatus = getStatus(type, slug);

  const handleClick = useCallback(
    (e: React.MouseEvent, status: MasteryStatus) => {
      e.preventDefault();
      e.stopPropagation();

      if (!user) {
        signInWithGoogle();
        return;
      }

      // Toggle: clicking same status clears (unmarked)
      if (currentStatus === status) {
        clearStatus(type, slug);
      } else {
        setStatus(type, slug, status);
      }
    },
    [user, signInWithGoogle, currentStatus, setStatus, clearStatus, type, slug],
  );

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {STATUSES.map((s) => {
        const isActive = currentStatus === s.value;
        return (
          <button
            key={s.value}
            type="button"
            onClick={(e) => handleClick(e, s.value)}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1 rounded-full text-xs transition-all duration-200 active:scale-90',
              showLabels ? 'px-2 py-1' : 'p-1',
              isActive ? s.active : s.idle,
            )}
            title={s.label[locale] ?? s.label.en}
          >
            <s.icon className={cn(showLabels ? 'h-4 w-4' : 'h-5 w-5')} />
            {showLabels && <span className="font-semibold">{s.label[locale] ?? s.label.en}</span>}
          </button>
        );
      })}
    </div>
  );
}
