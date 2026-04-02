import { useCallback } from "react";
import { useMessage } from "../../components/MessageProvider";

interface Props {
  useMutationHook: any;
  successMessage?: string;
  onSuccess?: (data?: any) => void;
  onFailure?: (data?: any) => void;
}

/**
 * Custom hook to handle API mutations with success and error messages
 * @param {Function} useMutationHook - The mutation hook from RTK Query
 * @param {string} success - The success message to display
 * @returns {Function} - The function to call the mutation
 */
const useApiPostMutation = (props: Props) => {
  const { useMutationHook, successMessage, onSuccess, onFailure } = props;
  const [mutationFn, { isLoading, isSuccess }] = useMutationHook();
  const { message } = useMessage();

  const callPostApi = useCallback(
    async (body) => {
      try {
        const data = await mutationFn(body).unwrap();
        if (successMessage) {
          message.success(successMessage);
        }
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error: any) {
        message.error(
          error?.message || "Thiết bị không hỗ trợ hoặc đã có lỗi xảy ra."
        );
        if (onFailure) {
          onFailure(error);
        }
      }
    },
    [mutationFn, successMessage, onSuccess, onFailure]
  );

  return { callPostApi, isLoading, isSuccess };
};

/**
 * Custom hook to handle API mutations with success and error messages
 * @param {Function} useMutationHook - The mutation hook from RTK Query
 * @param {string} success - The success message to display
 * @returns {Function} - The function to call the mutation
 */
const useApiPutMutation = (props: Props) => {
  const { useMutationHook, successMessage, onSuccess, onFailure } = props;
  const [mutationFn, { isLoading }] = useMutationHook();
  const { message } = useMessage();

  const callPutApi = useCallback(
    async (body, params) => {
      try {
        const data = await mutationFn({ body, params }).unwrap();
        if (successMessage) {
          message.success(successMessage);
        }
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error: any) {
        message.error(
          error?.message || "Thiết bị không hỗ trợ hoặc đã có lỗi xảy ra."
        );
        if (onFailure) {
          onFailure(error);
        }
      }
    },
    [mutationFn, successMessage, onSuccess, onFailure]
  );

  return { callPutApi, isLoading };
};

/**
 * Custom hook to handle API mutations with success and error messages
 * @param {Function} useMutationHook - The mutation hook from RTK Query
 * @param {string} success - The success message to display
 * @returns {Function} - The function to call the mutation
 */
const useApiPatchMutation = (props: Props) => {
  const { useMutationHook, successMessage, onSuccess, onFailure } = props;
  const [mutationFn, { isLoading }] = useMutationHook();
  const { message } = useMessage();

  const callPatchApi = useCallback(
    async (body, params) => {
      try {
        const data = await mutationFn({ body, params }).unwrap();
        if (successMessage) {
          message.success(successMessage);
        }
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error: any) {
        message.error(
          error?.message || "Thiết bị không hỗ trợ hoặc đã có lỗi xảy ra."
        );
        if (onFailure) {
          onFailure(error);
        }
      }
    },
    [mutationFn, successMessage, onSuccess, onFailure]
  );

  return { callPatchApi, isLoading };
};

/**
 * Custom hook to handle API mutations with success and error messages
 * @param {Function} useMutationHook - The mutation hook from RTK Query
 * @param {string} successMessage - The success message to display
 * @returns {Function} - The function to call the mutation
 */
const useApiDeleteMutation = (props: Props) => {
  const { useMutationHook, successMessage, onSuccess, onFailure } = props;
  const [mutationFn, { isLoading }] = useMutationHook();
  const { message } = useMessage();

  const callDeleteApi = useCallback(
    async (params) => {
      try {
        const data = await mutationFn(params).unwrap();
        if (successMessage) {
          message.success(successMessage);
        }
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error: any) {
        message.error(
          error?.message || "Thiết bị không hỗ trợ hoặc đã có lỗi xảy ra."
        );
        if (onFailure) {
          onFailure(error);
        }
      }
    },
    [mutationFn, successMessage, onSuccess, onFailure]
  );

  return { callDeleteApi, isLoading };
};

export {
  useApiPostMutation,
  useApiPutMutation,
  useApiPatchMutation,
  useApiDeleteMutation,
};
