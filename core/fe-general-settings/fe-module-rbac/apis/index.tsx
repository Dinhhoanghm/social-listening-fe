import {
  baseApi,
  deleteBaseApi,
  getBaseApi,
  postBaseApi,
  putBaseApi,
  SearchBody,
} from "@/fe-base/apis";

const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchRbacs: postBaseApi<SearchBody>(
      "/auth-service/api/v1/role/search",
      builder,
    ),
    getRbacPermissionById: getBaseApi<{ id: number }>(
      "/auth-service/api/v1/role/detail",
      builder,
      { keepUnusedDataFor: 0 },
    ),
    getRbacPermission: getBaseApi(
      "/auth-service/api/v1/role/permission",
      builder,
      {
        keepUnusedDataFor: 0,
      },
    ),
    addRbac: postBaseApi<any>("/auth-service/api/v1/role/add", builder),
    updateRbac: putBaseApi<any, { id: number }>(
      "/auth-service/api/v1/role/update",
      builder,
    ),
    deleteRbac: deleteBaseApi<{ id: number }>(
      "/auth-service/api/v1/role/delete",
      builder,
    ),
    multiDeleteRole: postBaseApi<{ id: number }[]>(
      "/auth-service/api/v1/role/multi-delete",
      builder,
    ),
    getMenu: getBaseApi("/auth-service/api/v1/role/menu", builder),
    getSelectRole: getBaseApi("/auth-service/api/v1/role/select", builder, {
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useSearchRbacsMutation,
  useGetRbacPermissionByIdQuery,
  useGetRbacPermissionQuery,
  useAddRbacMutation,
  useUpdateRbacMutation,
  useDeleteRbacMutation,
  useMultiDeleteRoleMutation,
  useLazyGetMenuQuery,
  useGetSelectRoleQuery,
} = permissionApi;
