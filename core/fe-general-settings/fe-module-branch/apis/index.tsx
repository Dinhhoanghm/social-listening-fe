import {
  baseApi,
  deleteBaseApi,
  getBaseApi,
  postBaseApi,
  putBaseApi,
} from "@/fe-base/apis";

interface CreateBody {
  code: string;
  name: string;
  parentId: string;
}

interface UpdatedBody {
  code: string;
  name: string;
  parentId: string;
  isActive: boolean;
}

export const organizationStructureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrgTree: getBaseApi("/auth-service/api/v1/org/tree", builder),
    getSelectBranch: getBaseApi("/auth-service/api/v1/branch/select", builder, {
      keepUnusedDataFor: 0,
    }),
    postCreateBranch: postBaseApi<CreateBody>(
      "/auth-service/api/v1/branch/add",
      builder
    ),
    putUpdateBranch: putBaseApi<UpdatedBody, { id: string }>(
      "/auth-service/api/v1/branch/update",
      builder
    ),
    deleteBranch: deleteBaseApi<{ id: string }>(
      "/auth-service/api/v1/branch/delete",
      builder
    ),
  }),
});

export const {
  useLazyGetOrgTreeQuery,
  useGetSelectBranchQuery,
  usePostCreateBranchMutation,
  usePutUpdateBranchMutation,
  useDeleteBranchMutation,
} = organizationStructureApi;
