import { Typography } from "antd";

// Apis
import { useDeleteRbacMutation } from "../../apis";
import { useApiDeleteMutation } from "@/fe-cores/hooks/useApiMutation";

// Constant
import { Rbac } from "../../constants/type";
import AModal from "@/fe-component/AModal";
interface Props {
  refresh: () => void;
  data: Rbac;
  open: boolean;
  onCancelModal: () => void;
}

const DeleteModal = (props: Props) => {
  const { data, open, onCancelModal, refresh } = props;
  const { callDeleteApi, isLoading } = useApiDeleteMutation({
    useMutationHook: useDeleteRbacMutation,
    onSuccess: () => {
      refresh();
      onCancelModal();
    },
    successMessage: "Xóa quyền thành công",
  });

  const handleDelete = () => {
    callDeleteApi({ id: data?.id });
  };

  return (
    <AModal
      title={"Xóa phân quyền"}
      open={open}
      cancelText={"Hủy bỏ"}
      onCancel={onCancelModal}
      okText={"Xác nhận"}
      onOk={handleDelete}
      destroyOnClose
    >
      <Typography.Text>
        Bạn chắc chắn muốn xóa phân quyền:{" "}
        <Typography.Text type="danger">{data?.name}</Typography.Text>
      </Typography.Text>
    </AModal>
  );
};

export default DeleteModal;
