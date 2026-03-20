import { notFound } from 'next/navigation';
import { getWordBySlug } from '@/lib/db';
import { WordDrawer } from '@/components/word-drawer';
import { WordDrawerContent } from '@/components/word-drawer-content';

export default async function WordDrawerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const word = await getWordBySlug(slug);

  if (!word) {
    notFound();
  }

  return (
    <WordDrawer>
      <WordDrawerContent word={word} />
    </WordDrawer>
  );
}
