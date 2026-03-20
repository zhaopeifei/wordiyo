import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim().toLowerCase();

  if (!q || q.length < 2 || q.length > 50) {
    return NextResponse.json({ words: [] });
  }

  const { data, error } = await supabase
    .from('words')
    .select('slug, lemma, pos, definition')
    .ilike('lemma', `${q}%`)
    .limit(8);

  if (error) {
    console.error('search API error:', error);
    return NextResponse.json({ words: [] });
  }

  const words = (data ?? []).map((row) => {
    const r = row as { slug: string; lemma: string; pos: string[]; definition: { en: string; zh: string } };
    return { slug: r.slug, lemma: r.lemma, pos: r.pos, definition: r.definition };
  });

  return NextResponse.json({ words });
}
