import {useCallback} from 'react';
import Toast from 'react-native-toast-message';

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
  const {useMutationHook, successMessage, onSuccess, onFailure} = props;
  const [mutationFn, {isLoading, isSuccess}] = useMutationHook();

  const callPostApi = useCallback(
    async body => {
      try {
        const data = await mutationFn(body).unwrap();
        if (successMessage) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: successMessage,
            visibilityTime: 3000,
          });
        }
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1:
            error?.message || 'Thiết bị không hỗ trợ hoặc đã có lỗi xảy ra.',
          visibilityTime: 3000,
        });
        if (onFailure) {
          onFailure(error);
        }
      }
    },
    [mutationFn, successMessage, onSuccess, onFailure],
  );

  return {callPostApi, isLoading, isSuccess};
};

/**
 * Custom hook to handle API mutations with success and error messages
 * @param {Function} useMutationHook - The mutation hook from RTK Query
 * @param {string} success - The success message to display
 * @returns {Function} - The function to call the mutation
 */
const useApiPutMutation = (props: Props) => {
  const {useMutationHook, successMessage, onSuccess, onFailure} = props;
  const [mutationFn, {isLoading}] = useMutationHook();

  const callPutApi = useCallback(
    async (body, params) => {
      try {
        const data = await mutationFn({body, params}).unwrap();
        if (successMessage) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: successMessage,
            visibilityTime: 3000,
          });
        }
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1:
            error?.message || 'Thiết bị không hỗ trợ hoặc đã có lỗi xảy ra.',
          visibilityTime: 3000,
        });
        if (onFailure) {
          onFailure(error);
        }
      }
    },
    [mutationFn, successMessage, onSuccess, onFailure],
  );

  return {callPutApi, isLoading};
};

/**
 * Custom hook to handle API mutations with success and error messages
 * @param {Function} useMutationHook - The mutation hook from RTK Query
 * @param {string} success - The success message to display
 * @returns {Function} - The function to call the mutation
 */
const useApiPatchMutation = (props: Props) => {
  const {useMutationHook, successMessage, onSuccess, onFailure} = props;
  const [mutationFn, {isLoading}] = useMutationHook();

  const callPatchApi = useCallback(
    async (body, params) => {
      try {
        const data = await mutationFn({body, params}).unwrap();
        if (successMessage) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: successMessage,
            visibilityTime: 3000,
          });
        }
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1:
            error?.message || 'Thiết bị không hỗ trợ hoặc đã có lỗi xảy ra.',
          visibilityTime: 3000,
        });
        if (onFailure) {
          onFailure(error);
        }
      }
    },
    [mutationFn, successMessage, onSuccess, onFailure],
  );

  return {callPatchApi, isLoading};
};

/**
 * Custom hook to handle API mutations with success and error messages
 * @param {Function} useMutationHook - The mutation hook from RTK Query
 * @param {string} successMessage - The success message to display
 * @returns {Function} - The function to call the mutation
 */
const useApiDeleteMutation = (props: Props) => {
  const {useMutationHook, successMessage, onSuccess, onFailure} = props;
  const [mutationFn, {isLoading}] = useMutationHook();

  const callDeleteApi = useCallback(
    async params => {
      try {
        const data = await mutationFn(params).unwrap();
        if (successMessage) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: successMessage,
            visibilityTime: 3000,
          });
        }
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1:
            error?.message || 'Thiết bị không hỗ trợ hoặc đã có lỗi xảy ra.',
          visibilityTime: 3000,
        });
        if (onFailure) {
          onFailure(error);
        }
      }
    },
    [mutationFn, successMessage, onSuccess, onFailure],
  );

  return {callDeleteApi, isLoading};
};

export {
  useApiPostMutation,
  useApiPutMutation,
  useApiPatchMutation,
  useApiDeleteMutation,
};
