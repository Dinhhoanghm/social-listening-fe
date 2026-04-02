import {
  baseApi,
  deleteBaseApi,
  getBaseApi,
  postBaseApi,
  putBaseApi,
  SearchBody,
} from "@/fe-base/apis";
import { CreateCrawlerConfig, UpdatedCrawlerConfig, CreateComicData, UpdatedComicData, CreateCrawledComic, UpdatedCrawledComic, CreateCrawledComicMetadata, UpdatedCrawledComicMetadata } from "../constants/type";
import { get } from "lodash";

export const crawlerConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCrawlerConfig: postBaseApi<SearchBody>(
      "/crawler-service/api/v1/crawler-configs/search",
      builder
    ),
    addCrawlerConfig: postBaseApi<CreateCrawlerConfig>(
      "/crawler-service/api/v1/crawler-configs/add",
      builder
    ),
    updateCrawlerConfig: putBaseApi<UpdatedCrawlerConfig, { id: number }>(
      "/crawler-service/api/v1/crawler-configs/update",
      builder
    ),
    deleteCrawlerConfig: deleteBaseApi<{ id: number }>(
      "/crawler-service/api/v1/crawler-configs/delete",
      builder
    ),
    selectCrawlerConfig: getBaseApi<{}>(
      "/crawler-service/api/v1/crawler-configs/select",
      builder
    ),
    multiDeleteCrawlerConfig: postBaseApi<SearchBody>(
      "/crawler-service/api/v1/crawler-configs/multi-delete",
      builder
    ),
    getCrawlerConfigDetail: getBaseApi<{ id: number }>(
      "/crawler-service/api/v1/crawler-configs/detail",
      builder
    ),
  }),
});

export const comicDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchComicData: postBaseApi<SearchBody>(
      "/crawler-service/api/v1/crawled-comic-data/search",
      builder
    ),
    addComicData: postBaseApi<CreateComicData>(
      "/crawler-service/api/v1/crawled-comic-data/add",
      builder
    ),
    updateComicData: putBaseApi<UpdatedComicData, { id: number }>(
      "/crawler-service/api/v1/crawled-comic-data/update",
      builder
    ),
    deleteComicData: deleteBaseApi<{ id: number }>(
      "/crawler-service/api/v1/crawled-comic-data/delete",
      builder
    ),
    selectComicData: getBaseApi<{}>(
      "/crawler-service/api/v1/crawled-comic-data/select",
      builder
    ),
    multiDeleteComicData: postBaseApi<SearchBody>(
      "/crawler-service/api/v1/crawled-comic-data/multi-delete",
      builder
    ),
  }),
});

export const crawledComicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCrawledComic: postBaseApi<SearchBody>(
      "/crawler-service/api/v1/crawled-comic/search",
      builder
    ),
    addCrawledComic: postBaseApi<CreateCrawledComic>(
      "/crawler-service/api/v1/crawled-comic/add",
      builder
    ),
    updateCrawledComic: putBaseApi<UpdatedCrawledComic, { id: number }>(
      "/crawler-service/api/v1/crawled-comic/update",
      builder
    ),
    deleteCrawledComic: deleteBaseApi<{ id: number }>(
      "/crawler-service/api/v1/crawled-comic/delete",
      builder
    ),
    selectCrawledComic: getBaseApi<{}>(
      "/crawler-service/api/v1/crawled-comic/select",
      builder
    ),
    multiDeleteCrawledComic: postBaseApi<SearchBody>(
      "/crawler-service/api/v1/crawled-comic/multi-delete",
      builder
    ),
    searchCrawledComicMetadata: postBaseApi<SearchBody>(
      "/crawler-service/api/v1/crawled-comic/metadata/search",
      builder
    ),
    addCrawledComicMetadata: postBaseApi<CreateCrawledComicMetadata>(
      "/crawler-service/api/v1/crawled-comic/metadata/add",
      builder
    ),
    updateCrawledComicMetadata: putBaseApi<UpdatedCrawledComicMetadata, { id: number }>(
      "/crawler-service/api/v1/crawled-comic/metadata/update",
      builder
    ),
    multiDeleteCrawledComicMetadata: postBaseApi<SearchBody>(
      "/crawler-service/api/v1/crawled-comic/metadata/multi-delete",
      builder
    ),
    getCrawledComicDetail: getBaseApi<{ id: number }>(
      "/crawler-service/api/v1/crawled-comic/detail",
      builder
    ),
    unlockCrawledComicChapter: postBaseApi<{ username: string; password: string; chapterId: number }>(
      "/crawler-service/api/v1/crawled-comic/unlock_chapter",
      builder
    ),
    unlockCrawledComic: postBaseApi<{ username: string; password: string; comicId: number }>(
      "/crawler-service/api/v1/crawled-comic/unlock_comic",
      builder
    ),
  }),
});

export const {
  useSearchCrawlerConfigMutation,
  useAddCrawlerConfigMutation,
  useDeleteCrawlerConfigMutation,
  useUpdateCrawlerConfigMutation,
  useLazySelectCrawlerConfigQuery,
  useMultiDeleteCrawlerConfigMutation,
  useLazyGetCrawlerConfigDetailQuery,
} = crawlerConfigApi;

export const {
  useSearchComicDataMutation,
  useAddComicDataMutation,
  useDeleteComicDataMutation,
  useUpdateComicDataMutation,
  useLazySelectComicDataQuery,
  useMultiDeleteComicDataMutation,
} = comicDataApi;

export const {
  useSearchCrawledComicMutation,
  useAddCrawledComicMutation,
  useDeleteCrawledComicMutation,
  useUpdateCrawledComicMutation,
  useLazySelectCrawledComicQuery,
  useMultiDeleteCrawledComicMutation,
  useSearchCrawledComicMetadataMutation,
  useAddCrawledComicMetadataMutation,
  useUpdateCrawledComicMetadataMutation,
  useMultiDeleteCrawledComicMetadataMutation,
  useLazyGetCrawledComicDetailQuery,
  useUnlockCrawledComicChapterMutation,
  useUnlockCrawledComicMutation,
} = crawledComicApi;