'use client';

import { useLanguage } from '@/components/language-provider';

const PAGE_SIZE = 30;

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  const showCount = 7; // 显示 7 个连续页码

  if (total <= showCount) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(showCount / 2); // 3
  let start = Math.max(1, current - half);
  let end = Math.min(total, current + half);

  // 窗口过小时自动扩展
  if (end - start < showCount - 1) {
    if (start === 1) {
      end = Math.min(total, start + showCount - 1);
    } else {
      start = Math.max(1, end - showCount + 1);
    }
  }

  const pages: (number | 'ellipsis')[] = [];

  // 始终显示首页
  pages.push(1);

  // 如果窗口不是从 2 开始，加省略号
  if (start > 2) pages.push('ellipsis');

  // 显示窗口内的页码
  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== total) pages.push(i);
  }

  // 如果窗口不是到末页-1结束，加省略号
  if (end < total - 1) pages.push('ellipsis');

  // 始终显示末页
  pages.push(total);

  return pages;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { dictionary } = useLanguage();

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex flex-col items-center gap-3 pt-2">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          {dictionary.previousPage}
        </button>

        {getPageNumbers(currentPage, totalPages).map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`e${i}`} className="px-1 text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 cursor-pointer rounded-full text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-foreground hover:bg-muted'
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
        >
          {dictionary.nextPage}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {dictionary.pageOf
          .replace('{current}', String(currentPage))
          .replace('{total}', String(totalPages))}
      </p>
    </nav>
  );
}

export { PAGE_SIZE };
