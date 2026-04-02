import {
  baseApi,
  deleteBaseApi,
  getBaseApi,
  postBaseApi,
  putBaseApi,
  SearchBody,
} from "@/fe-base/apis";
import { CreatePosition, UpdatedPosition } from "../constants/type";
import { get } from "lodash";

export const positionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchPosition: postBaseApi<SearchBody>(
      "/auth-service/api/v1/position/search",
      builder
    ),
    addPosition: postBaseApi<CreatePosition>(
      "/auth-service/api/v1/position/add",
      builder
    ),
    updatePosition: putBaseApi<UpdatedPosition, { id: number }>(
      "/auth-service/api/v1/position/update",
      builder
    ),
    deletePosition: deleteBaseApi<{ id: number }>(
      "/auth-service/api/v1/position/delete",
      builder
    ),
    selectPosition: getBaseApi<{}>(
      "/auth-service/api/v1/position/select",
      builder
    ),
    multiDeletePosition: postBaseApi<SearchBody>(
      "/auth-service/api/v1/position/multi-delete",
      builder
    ),
  }),
});

export const {
  useSearchPositionMutation,
  useAddPositionMutation,
  useDeletePositionMutation,
  useUpdatePositionMutation,
  useLazySelectPositionQuery,
  useMultiDeletePositionMutation,
} = positionApi;
