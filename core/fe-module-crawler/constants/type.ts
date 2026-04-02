export interface ItemPath {
  locatorType: string;
  locatorValue: string;
  attribute: string;
  parserScript?: string;
}

export interface ApiTemplateDTO {
  method: string;
  fieldPage: string;
  loadMorePage: boolean;
  params: Record<string, any>;
  headers: Record<string, any>;
  urls: string[];
}

export interface CrawlerDetail {
  titlePath?: ItemPath;
  descriptionPath?: ItemPath;
  imageUrlPath?: ItemPath;
  imageVerticalPath?: ItemPath;
  imageSquarePath?: ItemPath;
  statusPath?: ItemPath;
  viewPath?: ItemPath;
  tagsPath?: ItemPath;
  chaptersPath?: ItemPath;
  chapterNamePath?: ItemPath;
  chapterUrlPath?: ItemPath;
  chapterNumberPath?: ItemPath;
  blockChapterPath?: ItemPath;
  chapterPagesPath?: ItemPath;
  pageNumberPath?: ItemPath;
  pageNumberImagePath?: ItemPath;
  pageNumberContentPath?: ItemPath;
  chapterNumberParser?: string;
  detailApiTemplate?: ApiTemplateDTO;
  chapterApiTemplate?: ApiTemplateDTO;
  pagesApiTemplate?: ApiTemplateDTO;
}

export interface CrawlerConfig {
  id: number;
  name: string;
  url: string;
  isActive: boolean;
  frequencyHour?: number;
  crawlerType?: string;
  storyType?: string;
  createdAt: number;
  creator: string;
  updater: string;
  updatedAt: number;

  // WEB mode - List view paths
  listItemPath?: ItemPath;
  titlePath?: ItemPath;
  imageUrlPath?: ItemPath;
  detailUrlPath?: ItemPath;
  lastestChapterPath?: ItemPath;
  nextPagePath?: ItemPath;

  // WEB mode - Detail view paths (nested in crawlerDetail)
  crawlerDetail?: CrawlerDetail;

  // API mode - API configurations
  listApiTemplate?: ApiTemplateDTO;
  detailApiTemplate?: ApiTemplateDTO;
  chapterApiTemplate?: ApiTemplateDTO;
  pagesApiTemplate?: ApiTemplateDTO;
}

export interface CreateCrawlerConfig {
  name: string;
  url: string;
  frequencyHour?: number;
  crawlerType?: string;
  storyType?: string;
}

export interface UpdatedCrawlerConfig {
  id: number;
  name: string;
  url: string;
  isActive: boolean;
  frequencyHour?: number;
  crawlerType?: string;
  storyType?: string;

  // List view paths - WEB mode
  listItemPath?: ItemPath;
  titlePath?: ItemPath;
  imageUrlPath?: ItemPath;
  detailUrlPath?: ItemPath;
  lastestChapterPath?: ItemPath;
  nextPagePath?: ItemPath;

  // Detail view configuration
  crawlerDetail?: CrawlerDetail;

  // API mode - List API configuration
  listApiTemplate?: ApiTemplateDTO;
}

export interface ComicData {
  id: number;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  status: string;
  isActive: boolean;
  createdAt: number;
  creator: string;
  updater: string;
  updatedAt: number;
  chapterCounts?: number;
  pageCounts?: number;
}

export interface CreateComicData {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  status: string;
}

export interface UpdatedComicData {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  status: string;
  isActive: boolean;
}

export interface CrawledComic {
  id: number;
  comicId: number;
  chapterNumber: number;
  chapterTitle: string;
  chapterUrl: string;
  crawledAt: number;
  isActive: boolean;
  createdAt: number;
  creator: string;
  updater: string;
  updatedAt: number;
  numCoin?: number;
  crawledChapterCount?: number;
  pageCounts?: number;
  chapterCounts?: number;
}

export interface CreateCrawledComic {
  comicId: number;
  chapterNumber: number;
  chapterTitle: string;
  chapterUrl: string;
}

export interface UpdatedCrawledComic {
  comicId: number;
  chapterNumber: number;
  chapterTitle: string;
  chapterUrl: string;
  isActive: boolean;
}

export interface CrawledComicMetadata {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  authorId?: number;
  status: string;
  viewCount: string;
  orgId?: number;
  originId: string;
  tags: string[];
  comicDataId: string;
  migrateAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateCrawledComicMetadata {
  title: string;
  description: string;
  coverUrl: string;
  authorId?: number;
  status: string;
  viewCount: string;
  orgId?: number;
  originId: string;
  tags: string[];
  comicDataId: string;
}

export interface UpdatedCrawledComicMetadata {
  title: string;
  description: string;
  coverUrl: string;
  authorId?: number;
  status: string;
  viewCount: string;
  orgId?: number;
  originId: string;
  tags: string[];
  comicDataId: string;
}