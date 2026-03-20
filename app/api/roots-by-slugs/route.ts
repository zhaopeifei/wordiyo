import { NextResponse } from 'next/server';
import { getRootsBySlugs } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const slugs = body?.slugs;
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return NextResponse.json([]);
  }
  const safe = slugs.filter((s): s is string => typeof s === 'string').slice(0, 100);
  const roots = await getRootsBySlugs(safe);
  return NextResponse.json(roots);
}
