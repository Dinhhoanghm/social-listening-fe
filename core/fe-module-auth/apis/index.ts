import { baseApi, postBaseApi, getBaseApi, putBaseApi } from "@/fe-base/apis";

export const authApi: any = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    postLogin: postBaseApi<{ username: string; password: number }>(
      process.env.AUTH_URL_POST_LOGIN,
      builder
    ),

    getMeAuth: getBaseApi(process.env.AUTH_URL_GET_ME, builder),

    changePassword: postBaseApi<{ password: string; newPassword: string }>(
      process.env.AUTH_URL_CHANGE_PASSWORD,
      builder
    ),

    updateMeAuth: putBaseApi<{
      avatar: string;
      fullName: string;
      email: string;
      phoneNumber: number;
    }>(process.env.AUTH_URL_UPDATE_ME, builder),
  }),
});

export const {
  usePostLoginMutation,
  useLazyGetMeAuthQuery,
  useChangePasswordMutation,
  useUpdateMeAuthMutation,
} = authApi;
