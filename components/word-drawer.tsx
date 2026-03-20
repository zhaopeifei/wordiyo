'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WordDrawerProps {
  children: React.ReactNode;
}

export function WordDrawer({ children }: WordDrawerProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <motion.aside
          className="bg-background relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto shadow-2xl sm:w-[480px]"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          role="dialog"
          aria-modal="true"
          aria-label="Word details"
        >
          {/* Close button */}
          <div className="sticky top-0 z-10 flex justify-end p-4">
            <button
              type="button"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground rounded-full p-2 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 pb-8">
            {children}
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}
