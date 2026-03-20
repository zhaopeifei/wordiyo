import fs from 'fs';
import path from 'path';
import { createJiti } from 'jiti';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'articles');

const jiti = createJiti(import.meta.url, {
  moduleCache: false,
  fsCache: false,
});

export function getAllSlugs(category: string): string[] {
  const dir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

export async function loadMeta<T>(category: string, slug: string): Promise<T> {
  const filePath = path.join(CONTENT_DIR, category, slug, 'meta.ts');
  const mod = await jiti.import(filePath);
  return (mod as { default: T }).default;
}

export function getMdxSource(category: string, slug: string): string | null {
  const filePath = path.join(CONTENT_DIR, category, slug, 'content.mdx');
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}
