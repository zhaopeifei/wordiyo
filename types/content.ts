import type { Locale } from '@/content/site';

// 词源类型
export type EtymologyType =
  | 'root-derived'
  | 'native'
  | 'eponym'
  | 'loanword'
  | 'blend'
  | 'onomatopoeia'
  | 'unknown';

// 标签（考试、CEFR、词频等分类标签）
export interface Tag {
  slug: string;
  name: Record<Locale, string>;
  type: 'exam' | 'cefr' | 'frequency';
}

// 带排序的多语言例句
export interface WordExample {
  content: Record<Locale, string>;
  sortOrder: number;
}

/** Structured definition for a single part of speech. */
export interface WordSense {
  pos: string;
  definition: Record<Locale, string>;
  sortOrder: number;
}

export interface RootEntry {
  slug: string; // 词根的唯一标识符
  variants: string[]; // 词根的变体，例如 [“hydr”, “hydro”, “hydra”]

  meaning: Record<Locale, string>; // 核心简义 (en:”do, act, drive”, zh:”干/做/动”)
  languageOfOrigin: LanguageOfOrigin; // 词源语言，Greek / Latin / ...
  etymology?: string; // 原始词源形式 (如 “Greek βίος”, “Latin agere”)
  overview: Record<Locale, string>; // 通俗的整体介绍，多语言
  originSummary: Record<Locale, string>; // 词源解释，来自哪种语言、原始形式、含义，多语言

  semanticDomains: SemanticDomain[]; // 词根的语义领域，代表”这个词根跟什么有关”，比如：[“water”, “science”]
  relatedRoots: string[]; // 相关词根（同语义 or 同学科），存 root 的 slug
  associatedWords: string[]; // 派生单词（包含这个词根的词），存 word 的 slug
  grimmLawGroup?: string; // 格林法则分组 (如 “b/p/f/v”, “d/t/s/z”)
}

export interface WordEntry {
  slug: string; // Word 的 ID，例如 "biology"
  lemma: string; // 词形原型
  pronunciation: {
    uk: { ipa: string }; // 英国英语发音
    us: { ipa: string }; // 美国英语发音
  };

  partOfSpeech: string[]; // 词性 ["n.", "v.", "adj."]
  definition: Record<Locale, string>; // 多语言释义（建议单数）
  senses?: WordSense[]; // 按词性分组的结构化释义
  examples: Array<Record<Locale, string[]>>; // 多语言例句，可放多个

  rootBreakdown: MorphemeSegment[]; // 词的构词拆解
  morphologyNote: Record<Locale, string>; // 解释词根如何组合出当前词义，多语言
  relatedWords: string[]; // 与该词语义或构词相关的兄弟词，["biological", "biologist"]

  collocations?: Record<Locale, string[]>; // 常见搭配 (en:["take action"], zh:["采取行动"])
  frequency?: 'common' | 'academic' | 'advanced' | 'rare'; // 词频分级
  tags?: string[]; // 标签 ["CET-4", "IELTS", "GRE"]

  // 数据库扩展字段（来自 Supabase enrichment）
  frequencyRank?: number; // 绝对词频排名（COCA）
  etymologyType?: EtymologyType; // 词源类型
}

export interface MorphemeSegment {
  surface: string; // 该片段在单词中的表面形式，比如 "bio" / "logy" / "o"
  type: 'root' | 'stem' | 'prefix' | 'suffix' | 'connector' | 'other'; // 该片段的类型：root / stem / prefix / suffix / connector / other
  rootSlug?: string; // 仅在有对应 RootEntry 时填写，例如 type === 'root'
  affixSlug?: string; // 关联到 AffixEntry，例如 type === 'prefix' | 'suffix'
  meaning?: Record<Locale, string>; // 该片段的含义，来自关联的 root 或 affix
}

export interface AffixEntry {
  slug: string; // 如 "pre", "tion", "able"
  form: string; // 显示形式 "pre-", "-tion", "-able/-ible"
  type: 'prefix' | 'suffix';
  meaning: Record<Locale, string>; // en:"before", zh:"在...之前"
  overview: Record<Locale, string>; // 较长说明
  languageOfOrigin: LanguageOfOrigin;
  examples: string[]; // 示例单词 slug: ["predict", "prepare"]
  grimmLawGroup?: string;
  baseAffixSlug?: string; // 变体词缀指向基础形式的 slug，如 ac- → ad
}

// 词源语言（有限集）
export type LanguageOfOrigin =
  | 'Greek'
  | 'Latin'
  | 'Old English'
  | 'Old French'
  | 'Germanic'
  | 'Proto-Indo-European'
  | 'Arabic'
  | 'Sanskrit'
  | 'Chinese'
  | 'Japanese'
  | 'Hebrew'
  | 'Other';

export type SemanticDomain =
  // 生物 & 自然界
  | 'life' // 生命（bio）
  | 'animals' // 动物
  | 'plants' // 植物
  | 'body' // 身体 (derm, cardi)
  | 'health' // 健康/疾病 (path, therap)
  | 'nature' // 自然（eco, geo 泛自然）

  // 物质世界
  | 'water' // hydr
  | 'earth' // geo
  | 'fire' // pyro
  | 'air' // aero
  | 'light' // photo, luc
  | 'sound' // phon, son, voc
  | 'color' // chrom

  // 抽象概念
  | 'time' // chron
  | 'space' // tele
  | 'number' // mono, poly
  | 'position' // sub-, super-
  | 'movement' // mot/mob, grad, ven/vent
  | 'change' // morph, meta
  | 'amount' // hyper, hypo, min, max

  // 认知 & 人类社会
  | 'mind' // psych, cogn
  | 'emotion' // pathos, anim
  | 'speech' // dict, log, voc, clam
  | 'knowledge' // sci, cogn, lect
  | 'power' // dyn, poten, fort, val
  | 'law' // nom, jur, leg
  | 'society' // socio, demo

  // 动作 & 行为
  | 'action' // act, ag, fac
  | 'transport' // port, fer, car
  | 'making' // fac, fec, fic
  | 'writing' // scrib, script, graph
  | 'seeing' // vis, vid, spec, spy
  | 'holding' // cap, cep, cip, ten
  | 'cutting' // cis, sect, tom
  | 'pushing' // pel, puls
  | 'pulling' // tract, tra
  | 'standing' // st, sist, stat
  | 'sitting' // sit, sid, sed
  | 'walking' // grad, gress, amb
  | 'eating' // vor, phag
  | 'breathing' // spir, anim
  | 'binding' // lig, nect, string
  | 'pressing' // press
  | 'flowing' // flu, flux, fus
  | 'turning' // vert, vers, tort
  | 'building' // struct
  | 'breaking' // frag, rupt, fract
  | 'choosing' // lect, opt, cern
  | 'giving' // don, dat
  | 'sending' // miss, mit
  | 'ordering' // ord, mand
  | 'measuring' // metr, mens

  // 性质 & 状态
  | 'size' // min, max, magn
  | 'similarity' // sim, sem, simil
  | 'strength' // fort, val, rob
  | 'death' // mort, nec
  | 'birth' // gen, nat, nasc
  | 'sleep' // somn, dorm
  | 'food' // nutr, alim

  // 其他
  | 'other';
