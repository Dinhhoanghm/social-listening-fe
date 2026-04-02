import React, { FC, memo } from "react";
import { Button, Modal, Typography } from "antd";

// Apis
import { useDeleteBranchMutation } from "../../apis";
import { useApiDeleteMutation } from "@/fe-cores/hooks/useApiMutation";

interface Props {
  data: any;
  open: boolean;
  onClose: Function;
  onRefresh: Function;
}

const { Text } = Typography;

const DeleteModal: FC<Props> = (props: Props) => {
  const { data, open, onClose, onRefresh } = props;

  const { callDeleteApi, isLoading } = useApiDeleteMutation({
    useMutationHook: useDeleteBranchMutation,
    onSuccess: () => {
      onRefresh();
      onClose();
    },
    successMessage: "Xoá chi nhánh thành công!",
  });

  const onSubmit = () => {
    callDeleteApi({ id: data?.id });
  };

  return (
    <Modal
      title={"Xóa chi nhánh"}
      destroyOnClose
      onCancel={() => onClose()}
      footer={[
        <Button htmlType="button" onClick={() => onClose()}>
          Hủy bỏ
        </Button>,
        <Button loading={isLoading} type="primary" onClick={() => onSubmit()}>
          Xác nhận
        </Button>,
      ]}
      open={open}
      centered
    >
      <Text>
        Bạn chắc chắn muốn xóa chi nhánh:{" "}
        <Text type="danger">{data?.name}</Text>
      </Text>
    </Modal>
  );
};

export default memo(DeleteModal);
