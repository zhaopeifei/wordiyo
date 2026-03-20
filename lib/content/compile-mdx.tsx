import { compile, run } from '@mdx-js/mdx';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { mdxComponents } from '@/components/mdx/mdx-components';
import { getMdxSource } from './loader';

/**
 * Compile MDX content from file path.
 * Call this in Server Components only.
 */
export async function compileMdxFromFile(
  category: string,
  slug: string
): Promise<React.ReactNode> {
  const source = getMdxSource(category, slug);

  if (!source) {
    return (
      <div className="bg-muted text-muted-foreground rounded-lg p-4">
        <p className="font-semibold">Content not found</p>
      </div>
    );
  }

  return compileMdx(source);
}

/**
 * Compile MDX source string.
 * Call this in Server Components only.
 */
export async function compileMdx(source: string): Promise<React.ReactNode> {
  try {
    const compiled = await compile(source, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    });

    const { default: MDXContent } = await run(compiled, {
      Fragment,
      jsx,
      jsxs,
      baseUrl: import.meta.url,
    });

    return <MDXContent components={mdxComponents} />;
  } catch (error) {
    console.error('Failed to compile MDX:', error);
    return (
      <div className="bg-muted text-muted-foreground rounded-lg p-4">
        <p className="font-semibold">Failed to render content</p>
        <p className="text-sm">There was an error processing the content.</p>
      </div>
    );
  }
}
