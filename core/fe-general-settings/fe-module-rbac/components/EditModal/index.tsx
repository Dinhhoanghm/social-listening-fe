import { Button, Form } from "antd";
import FormItems from "../FormItems";

// Apis
import {
  useGetRbacPermissionByIdQuery,
  useUpdateRbacMutation,
} from "../../apis";
import { useApiPutMutation } from "@/fe-cores/hooks/useApiMutation";

// Constain
import { SubmitRbac, Rbac } from "../../constants/type";
import { getMenusSubmitData } from "../CreateModal";
import { UPDATE_DATA } from "../../constants/data";
import AModal from "@/fe-component/AModal";
interface Props {
  refresh: () => void;
  data: Rbac;
  open: boolean;
  onCancelModal: () => void;
  disabled: boolean;
}

const EditModal = (props: Props) => {
  const { refresh, data, open, onCancelModal, disabled } = props;
  const [form] = Form.useForm();

  const { data: dataPermission, isLoading: isLoadingGetPermission } =
    useGetRbacPermissionByIdQuery({ id: data?.id });

  const { callPutApi, isLoading } = useApiPutMutation({
    useMutationHook: useUpdateRbacMutation,
    onSuccess: () => {
      refresh();
      onCancelModal();
    },
    successMessage: "Cập nhật quyền thành công",
  });

  const handleSubmit = (values: SubmitRbac) => {
    callPutApi(
      {
        code: values?.code,
        name: values?.name,
        isActive: values?.isActive,
        description: values?.description,
        menus: getMenusSubmitData(values?.menus),
      },
      { id: data?.id },
    );
  };

  return (
    <AModal
      title={disabled ? "Xem chi tiết phân quyền" : "Chỉnh sửa phân quyền"}
      open={open}
      onCancel={() => onCancelModal()}
      footer={[
        <Button key="btn-cancel" onClick={() => onCancelModal()}>
          {disabled ? "Đóng" : "Hủy"}
        </Button>,
        <>
          {!disabled && (
            <Button
              key="btn-edit"
              loading={isLoading}
              type="primary"
              form={"form-edit"}
              htmlType="submit"
            >
              Lưu
            </Button>
          )}
        </>,
      ]}
      width={"1048px"}
    >
      <Form
        id={"form-edit"}
        form={form}
        onFinish={handleSubmit}
        initialValues={UPDATE_DATA(data)}
        style={{ marginTop: "20px" }}
        layout="vertical"
        disabled={disabled}
      >
        <FormItems
          data={dataPermission}
          isLoading={isLoadingGetPermission}
          isEdit={true}
          disabled={disabled}
        />
      </Form>
    </AModal>
  );
};

export default EditModal;
