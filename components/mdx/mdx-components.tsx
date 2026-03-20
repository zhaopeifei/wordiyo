import { ComponentPropsWithoutRef } from 'react';
import { Trans } from './trans';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mdxComponents: Record<string, React.ComponentType<any>> = {
  Trans,
  h1: ({ children, id, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      id={id}
      className="font-heading text-foreground mt-10 mb-4 scroll-mt-24 text-3xl font-bold"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, id, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      id={id}
      className="font-heading text-foreground mt-8 mb-3 scroll-mt-24 text-2xl font-bold"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, id, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      id={id}
      className="font-heading text-foreground mt-6 mb-2 scroll-mt-24 text-xl font-semibold"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, id, ...props }: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      id={id}
      className="font-heading text-foreground mt-4 mb-2 scroll-mt-24 text-lg font-semibold"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
    <p
      className="text-foreground/85 mb-4 text-base leading-7"
      {...props}
    >
      {children}
    </p>
  ),
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => {
    const isExternal = href?.startsWith('http');
    return (
      <a
        href={href}
        className="text-primary underline underline-offset-2 hover:text-primary/80"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({ src, alt }: { src?: string; alt?: string }) => {
    if (!src) return null;
    if (src.startsWith('http') || src.startsWith('data:')) {
      return (
        <span className="my-4 block">
          <img
            src={src}
            alt={alt || ''}
            className="border-border w-full rounded-lg border"
          />
        </span>
      );
    }
    return null;
  },
  pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="bg-foreground/5 border-border my-4 overflow-x-auto rounded-lg border p-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<'code'>) => {
    if (!className) {
      return (
        <code
          className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-sm"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul className="mb-4 ml-1 list-disc space-y-1.5 pl-6" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
    <ol className="mb-4 ml-1 list-decimal space-y-1.5 pl-6" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => (
    <li className="text-foreground/85 text-base leading-7" {...props}>
      {children}
    </li>
  ),
  blockquote: ({
    children,
    ...props
  }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="border-primary/40 text-muted-foreground my-4 border-l-3 py-1 pl-4"
      {...props}
    >
      {children}
    </blockquote>
  ),
  hr: (props: ComponentPropsWithoutRef<'hr'>) => (
    <hr className="border-border my-8" {...props} />
  ),
  table: ({ children, ...props }: ComponentPropsWithoutRef<'table'>) => (
    <div className="border-border my-4 overflow-x-auto rounded-lg border">
      <table className="w-full min-w-max" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: ComponentPropsWithoutRef<'thead'>) => (
    <thead className="bg-muted" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: ComponentPropsWithoutRef<'th'>) => (
    <th
      className="border-border border-b p-3 text-left text-sm font-semibold"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: ComponentPropsWithoutRef<'td'>) => (
    <td
      className="border-border text-foreground/85 border-b p-3 text-sm"
      {...props}
    >
      {children}
    </td>
  ),
  strong: ({ children, ...props }: ComponentPropsWithoutRef<'strong'>) => (
    <strong className="text-foreground font-semibold" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: ComponentPropsWithoutRef<'em'>) => (
    <em className="text-foreground/75 italic" {...props}>
      {children}
    </em>
  ),
};
