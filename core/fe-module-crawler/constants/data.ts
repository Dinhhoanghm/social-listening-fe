import { CrawlerConfig, ComicData, CrawledComic } from "./type";

export const CRAWLER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
  ERROR: "error",
} as const;

export const COMIC_STATUS = {
  ONGOING: "ongoing",
  COMPLETED: "completed",
  DROPPED: "dropped",
  HIATUS: "hiatus",
} as const;

export const CREATE_CRAWLER_CONFIG_DATA = {
  name: "",
  url: "",
  frequencyHour: 1,
  crawlerType: "WEB"
};

export const UPDATE_CRAWLER_CONFIG_DATA = (data: CrawlerConfig) => ({
  name: data.name,
  url: data.url,
  isActive: data.isActive,
  frequencyHour: data.frequencyHour,
  crawlerType: data.crawlerType,
});

export const CREATE_COMIC_DATA = {
  title: "",
  description: "",
  url: "",
  imageUrl: "",
  status: "ongoing"
};

export const UPDATE_COMIC_DATA = (data: ComicData) => ({
  title: data.title,
  description: data.description,
  url: data.url,
  imageUrl: data.imageUrl,
  status: data.status,
  isActive: data.isActive,
});

export const CREATE_CRAWLED_COMIC_DATA = {
  comicId: null,
  chapterNumber: 0,
  chapterTitle: "",
  chapterUrl: ""
};

export const UPDATE_CRAWLED_COMIC_DATA = (data: CrawledComic) => ({
  comicId: data.comicId,
  chapterNumber: data.chapterNumber,
  chapterTitle: data.chapterTitle,
  chapterUrl: data.chapterUrl,
  isActive: data.isActive,
});