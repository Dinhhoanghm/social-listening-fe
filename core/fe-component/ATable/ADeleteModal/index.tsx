import React, { memo } from "react";
import { Typography } from "antd";

// Components
import AModal from "@/fe-component/AModal";

// Apis
import { useApiDeleteMutation } from "@/fe-cores/hooks/useApiMutation";

interface Props {
  refresh: () => void;
  data: { id: number; name: string };
  open: boolean;
  onCancelModal: () => void;
  title: string;
  useMutationHook: any;
}

const ADeleteModal = (props: Props) => {
  const { data, open, onCancelModal, refresh, title, useMutationHook } = props;
  const { callDeleteApi } = useApiDeleteMutation({
    useMutationHook: useMutationHook,
    onSuccess: () => {
      refresh();
      onCancelModal();
    },
    successMessage: `${title} thành công`,
  });

  const handleDelete = () => {
    callDeleteApi({ id: data?.id });
  };

  return (
    <AModal
      title={title}
      open={open}
      cancelText={"Hủy bỏ"}
      onCancel={onCancelModal}
      okText={"Xác nhận"}
      onOk={handleDelete}
      destroyOnClose
    >
      <Typography.Text>
        {`Bạn có chắc chắn muốn ${title} `}
        <Typography.Text type="danger">{data?.name}</Typography.Text>
        {` không?`}
      </Typography.Text>
    </AModal>
  );
};

export default memo(ADeleteModal);
