import { memo } from "react";
import { Button, Modal, Typography } from "antd";

// Apis
import { useDeletePositionMutation } from "../../apis";
import { useApiDeleteMutation } from "@/fe-cores/hooks/useApiMutation";

// Constants
import { Position } from "../../constants/type";

const { Text } = Typography;

interface Props {
  open: boolean;
  onCancelMoal: () => void;
  onRefresh: () => void;
  data: Position;
}

function DeleteModal(props: Props) {
  const { data, open, onCancelMoal, onRefresh } = props;

  const { callDeleteApi, isLoading } = useApiDeleteMutation({
    useMutationHook: useDeletePositionMutation,
    onSuccess: () => {
      onCancelMoal();
      onRefresh();
    },
    successMessage: "Xoá chức vụ thành công!",
  });

  const handleDeletePosition = () => {
    callDeleteApi({ id: data?.id });
  };

  return (
    <Modal
      title={"Xóa chức vụ"}
      open={open}
      onCancel={onCancelMoal}
      destroyOnClose
      footer={[
        <Button onClick={onCancelMoal}>Hủy bỏ</Button>,
        <Button
          loading={isLoading}
          key={"argee"}
          type="primary"
          onClick={handleDeletePosition}
        >
          Xác nhận
        </Button>,
      ]}
      centered
    >
      <Text>
        Bạn chắc chắn muốn xóa chức vụ: <Text type="danger">{data?.name}</Text>
      </Text>
    </Modal>
  );
}

export default memo(DeleteModal);
