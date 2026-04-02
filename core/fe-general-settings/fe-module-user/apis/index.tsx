import {
  baseApi,
  deleteBaseApi,
  getBaseApi,
  postBaseApi,
  putBaseApi,
  SearchBody,
} from "@/fe-base/apis";
import { CreateUser, UpdateUser } from "../constants/type";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchUser: postBaseApi<SearchBody>(
      "/auth-service/api/v1/user/search",
      builder
    ),
    getSelectUser: getBaseApi("/auth-service/api/v1/user/select", builder, {
      keepUnusedDataFor: 0,
    }),
    getDetailUser: getBaseApi<{ id: number }>(
      "/auth-service/api/v1/user/detail",
      builder
    ),
    createUser: postBaseApi<CreateUser>(
      "/auth-service/api/v1/user/add",
      builder
    ),
    updateUser: putBaseApi<UpdateUser, { id: number }>(
      "/auth-service/api/v1/user/update",
      builder
    ),
    resetPassUser: postBaseApi<{ id: number; newPassword: string }>(
      "/auth-service/api/v1/user/reset-password",
      builder
    ),
    deleteUser: deleteBaseApi<{ id: number }>(
      "/auth-service/api/v1/user/delete",
      builder
    ),
    multiDeleteUser: postBaseApi<SearchBody>(
      "/auth-service/api/v1/user/multi-delete",
      builder
    ),
  }),
});

export const {
  useSearchUserMutation,
  useGetSelectUserQuery,
  useLazyGetDetailUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useResetPassUserMutation,
  useMultiDeleteUserMutation,
} = userApi;
