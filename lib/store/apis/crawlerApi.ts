import { baseApi } from "@/lib/store/apis/baseApi";
import { transformDfResponse } from "@/lib/store/apis/dfResponse";
import type {
  CrawlerConfigDetail,
  CrawlerConfigRequestBody,
  CrawlerConfigRow,
  CrawlerCustomScriptRow,
  CrawlerFieldRequestBody,
  CrawlerFieldRow,
  CrawlerSourceRequestBody,
  CrawlerSourceRow,
  CrawlerStepLocatorRequestBody,
  CrawlerStepLocatorRow,
  CrawlerStepModel,
  CrawlerStepRequestBody,
} from "@/types/crawler";
import type { MultiDeleteResponse, Page, SearchRequest } from "@/types/api";

export const crawlerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCrawlerConfigs: builder.query<Page<CrawlerConfigRow>, SearchRequest>({
      query: (body) => ({
        url: "/api/v1/crawler-configs/search",
        method: "POST",
        body,
      }),
      transformResponse: transformDfResponse,
    }),

    getCrawlerConfigDetail: builder.query<CrawlerConfigDetail, { id: number }>(
      {
        query: ({ id }) => ({
          url: "/api/v1/crawler-configs/detail",
          params: { id },
        }),
        transformResponse: transformDfResponse,
        providesTags: (result, error, { id }) => [
          { type: "CrawlerConfig", id },
        ],
      }
    ),

    addCrawlerConfig: builder.mutation<
      CrawlerConfigRow,
      CrawlerConfigRequestBody
    >({
      query: (body) => ({
        url: "/api/v1/crawler-configs/add",
        method: "POST",
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: ["CrawlerConfig"],
    }),

    updateCrawlerConfig: builder.mutation<
      CrawlerConfigRow,
      { id: number; body: CrawlerConfigRequestBody }
    >({
      query: ({ id, body }) => ({
        url: "/api/v1/crawler-configs/update",
        method: "PUT",
        params: { id },
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (result, error, { id }) => [
        { type: "CrawlerConfig", id },
        "CrawlerConfig",
      ],
    }),

    deleteCrawlerConfig: builder.mutation<string, { id: number }>({
      query: ({ id }) => ({
        url: "/api/v1/crawler-configs/delete",
        method: "DELETE",
        params: { id },
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: ["CrawlerConfig"],
    }),

    multiDeleteCrawlerConfigs: builder.mutation<
      MultiDeleteResponse,
      number[]
    >({
      query: (ids) => ({
        url: "/api/v1/crawler-configs/multi-delete",
        method: "POST",
        body: ids,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: ["CrawlerConfig"],
    }),

    searchCrawlerSources: builder.query<Page<CrawlerSourceRow>, SearchRequest>(
      {
        query: (body) => ({
          url: "/api/v1/crawler-sources/search",
          method: "POST",
          body,
        }),
        transformResponse: transformDfResponse,
        providesTags: ["CrawlerSource"],
      }
    ),

    addCrawlerSource: builder.mutation<
      CrawlerSourceRow,
      CrawlerSourceRequestBody
    >({
      query: (body) => ({
        url: "/api/v1/crawler-sources/add",
        method: "POST",
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: ["CrawlerSource"],
    }),

    updateCrawlerSource: builder.mutation<
      CrawlerSourceRow,
      { id: number; body: CrawlerSourceRequestBody }
    >({
      query: ({ id, body }) => ({
        url: "/api/v1/crawler-sources/update",
        method: "PUT",
        params: { id },
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: ["CrawlerSource"],
    }),

    deleteCrawlerSource: builder.mutation<string, { id: number }>({
      query: ({ id }) => ({
        url: "/api/v1/crawler-sources/delete",
        method: "DELETE",
        params: { id },
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: ["CrawlerSource"],
    }),

    addCrawlerField: builder.mutation<
      CrawlerFieldRow,
      { body: CrawlerFieldRequestBody; crawlerConfigId: number }
    >({
      query: ({ body }) => ({
        url: "/api/v1/crawler-fields/add",
        method: "POST",
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (r, e, { crawlerConfigId }) => [
        { type: "CrawlerConfig", id: crawlerConfigId },
      ],
    }),

    updateCrawlerField: builder.mutation<
      CrawlerFieldRow,
      {
        id: number;
        body: CrawlerFieldRequestBody;
        crawlerConfigId: number;
      }
    >({
      query: ({ id, body }) => ({
        url: "/api/v1/crawler-fields/update",
        method: "PUT",
        params: { id },
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (r, e, { crawlerConfigId }) => [
        { type: "CrawlerConfig", id: crawlerConfigId },
      ],
    }),

    deleteCrawlerField: builder.mutation<
      string,
      { id: number; crawlerConfigId: number }
    >({
      query: ({ id }) => ({
        url: "/api/v1/crawler-fields/delete",
        method: "DELETE",
        params: { id },
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (r, e, { crawlerConfigId }) => [
        { type: "CrawlerConfig", id: crawlerConfigId },
      ],
    }),

    addCrawlerStep: builder.mutation<CrawlerStepModel, CrawlerStepRequestBody>(
      {
        query: (body) => ({
          url: "/api/v1/crawler-steps/add",
          method: "POST",
          body,
        }),
        transformResponse: transformDfResponse,
        invalidatesTags: (result, error, body) => [
          { type: "CrawlerConfig", id: body.crawlerConfigId },
        ],
      }
    ),

    updateCrawlerStep: builder.mutation<
      CrawlerStepModel,
      { id: number; body: CrawlerStepRequestBody }
    >({
      query: ({ id, body }) => ({
        url: "/api/v1/crawler-steps/update",
        method: "PUT",
        params: { id },
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (result, error, { body }) => [
        { type: "CrawlerConfig", id: body.crawlerConfigId },
      ],
    }),

    deleteCrawlerStep: builder.mutation<
      string,
      { id: number; crawlerConfigId: number }
    >({
      query: ({ id }) => ({
        url: "/api/v1/crawler-steps/delete",
        method: "DELETE",
        params: { id },
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (result, error, { crawlerConfigId }) => [
        { type: "CrawlerConfig", id: crawlerConfigId },
      ],
    }),

    searchCustomScripts: builder.query<
      Page<CrawlerCustomScriptRow>,
      SearchRequest
    >({
      query: (body) => ({
        url: "/api/v1/custom-scripts/search",
        method: "POST",
        body,
      }),
      transformResponse: transformDfResponse,
      providesTags: ["CustomScript"],
    }),

    getCustomScriptDetail: builder.query<CrawlerCustomScriptRow, { id: number }>(
      {
        query: ({ id }) => ({
          url: "/api/v1/custom-scripts/detail",
          params: { id },
        }),
        transformResponse: transformDfResponse,
        providesTags: (r, e, { id }) => [{ type: "CustomScript", id }],
      }
    ),

    addCustomScript: builder.mutation<
      CrawlerCustomScriptRow,
      { name: string; language: string; script: string; description?: string }
    >({
      query: (body) => ({
        url: "/api/v1/custom-scripts/add",
        method: "POST",
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: ["CustomScript"],
    }),

    updateCustomScript: builder.mutation<
      CrawlerCustomScriptRow,
      {
        id: number;
        body: {
          name: string;
          language: string;
          script: string;
          description?: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: "/api/v1/custom-scripts/update",
        method: "PUT",
        params: { id },
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (r, e, { id }) => [
        { type: "CustomScript", id },
        "CustomScript",
      ],
    }),

    deleteCustomScript: builder.mutation<string, { id: number }>({
      query: ({ id }) => ({
        url: "/api/v1/custom-scripts/delete",
        method: "DELETE",
        params: { id },
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: ["CustomScript"],
    }),

    addCrawlerStepLocator: builder.mutation<
      CrawlerStepLocatorRow,
      { body: CrawlerStepLocatorRequestBody; crawlerConfigId: number }
    >({
      query: ({ body }) => ({
        url: "/api/v1/crawler-step-locators/add",
        method: "POST",
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (r, e, { crawlerConfigId }) => [
        { type: "CrawlerConfig", id: crawlerConfigId },
      ],
    }),

    updateCrawlerStepLocator: builder.mutation<
      CrawlerStepLocatorRow,
      { id: number; body: CrawlerStepLocatorRequestBody; crawlerConfigId: number }
    >({
      query: ({ id, body }) => ({
        url: "/api/v1/crawler-step-locators/update",
        method: "PUT",
        params: { id },
        body,
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (r, e, { crawlerConfigId }) => [
        { type: "CrawlerConfig", id: crawlerConfigId },
      ],
    }),

    deleteCrawlerStepLocator: builder.mutation<
      string,
      { id: number; crawlerConfigId: number }
    >({
      query: ({ id }) => ({
        url: "/api/v1/crawler-step-locators/delete",
        method: "DELETE",
        params: { id },
      }),
      transformResponse: transformDfResponse,
      invalidatesTags: (r, e, { crawlerConfigId }) => [
        { type: "CrawlerConfig", id: crawlerConfigId },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useSearchCrawlerConfigsQuery,
  useGetCrawlerConfigDetailQuery,
  useAddCrawlerConfigMutation,
  useUpdateCrawlerConfigMutation,
  useDeleteCrawlerConfigMutation,
  useMultiDeleteCrawlerConfigsMutation,
  useSearchCrawlerSourcesQuery,
  useAddCrawlerSourceMutation,
  useUpdateCrawlerSourceMutation,
  useDeleteCrawlerSourceMutation,
  useAddCrawlerFieldMutation,
  useUpdateCrawlerFieldMutation,
  useDeleteCrawlerFieldMutation,
  useAddCrawlerStepMutation,
  useUpdateCrawlerStepMutation,
  useDeleteCrawlerStepMutation,
  useSearchCustomScriptsQuery,
  useGetCustomScriptDetailQuery,
  useAddCustomScriptMutation,
  useUpdateCustomScriptMutation,
  useDeleteCustomScriptMutation,
  useAddCrawlerStepLocatorMutation,
  useUpdateCrawlerStepLocatorMutation,
  useDeleteCrawlerStepLocatorMutation,
} = crawlerApi;
