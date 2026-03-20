import type { MorphemeSegment } from '@/types/content';

export const morphemeClass: Record<MorphemeSegment['type'], string> = {
  root: 'morpheme-root',
  stem: 'morpheme-root',
  prefix: 'morpheme-prefix',
  suffix: 'morpheme-suffix',
  connector: 'morpheme-connector',
  other: 'morpheme-connector',
};
