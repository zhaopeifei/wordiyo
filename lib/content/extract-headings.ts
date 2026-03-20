export interface TOCItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function extractHeadings(source: string): TOCItem[] {
  const headings = [...source.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((m) => ({
    id: generateSlug(m[2].trim()),
    text: m[2].trim(),
    level: m[1].length as 2 | 3,
    index: m.index!,
  }));

  return headings
    .sort((a, b) => a.index - b.index)
    .map(({ id, text, level }) => ({ id, text, level }));
}
