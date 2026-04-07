import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({

  baseUrl: "/api/backend",
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["CrawlerConfig", "CrawlerSource", "CustomScript"],
  endpoints: () => ({}),
});
