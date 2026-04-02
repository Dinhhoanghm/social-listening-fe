import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/** Extend with auth / reauth (e.g. mutex + refresh) like comic-web-admin when needed. */
export const baseQuery = fetchBaseQuery({
  /** Same-origin BFF — `app/api/backend/[...path]/route.ts` → `BACKEND_ORIGIN` (server-only). */
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
