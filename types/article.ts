export interface ArticleMeta {
  title: string;
  titleZh: string;
  category: 'learn' | 'read';
  tags: string[];
  author: string;
  date: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingTime: string;
  excerpt: string;
  excerptZh: string;
  vocabulary: string[];
}

export interface ArticleWithSlug extends ArticleMeta {
  slug: string;
}
