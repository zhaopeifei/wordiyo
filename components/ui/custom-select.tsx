'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RiArrowDownSLine } from '@remixicon/react';

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  'aria-label': string;
}

export const CustomSelect = ({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: CustomSelectProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="border-border bg-background text-muted-foreground hover:border-primary hover:text-primary flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-colors"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{selectedLabel}</span>
        <RiArrowDownSLine
          className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="border-border bg-card absolute left-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-xl border shadow-lg"
        >
          {options.map((opt) => {
            const isActive = value === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(opt.value)}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {isActive && <span className="text-primary text-xs">✓</span>}
                <span className={isActive ? '' : 'ml-5'}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
