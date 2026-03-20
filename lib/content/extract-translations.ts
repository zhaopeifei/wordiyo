export function extractTranslationLanguages(source: string): string[] {
  const re = /<Trans\s+lang="([^"]+)">/g;
  const langs = new Set<string>();
  let match;
  while ((match = re.exec(source)) !== null) {
    langs.add(match[1]);
  }
  return Array.from(langs);
}
