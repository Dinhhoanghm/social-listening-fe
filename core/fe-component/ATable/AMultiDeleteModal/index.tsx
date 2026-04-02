import React, { memo, useState } from "react";
import { Button, Typography } from "antd";

// Components
import AModal from "@/fe-component/AModal";

// Apis
import { useApiPostMutation } from "@/fe-cores/hooks/useApiMutation";
import { useMessage } from "@/fe-cores/components/MessageProvider";

interface Props {
  refresh: () => void;
  itemIds: React.Key[];
  setCheckedRowKeys: (itemIds: []) => void;
  title: string;
  useMutationHook: any;
  bodyApi?: any;
  name: string;
}

const AMultiDeleteModal = (props: Props) => {
  const {
    itemIds,
    refresh,
    title,
    name,
    useMutationHook,
    setCheckedRowKeys,
    bodyApi,
  } = props;
  const [open, setOpen] = useState(false);
  const { message } = useMessage();
  const { callPostApi } = useApiPostMutation({
    useMutationHook: useMutationHook,
    onSuccess: (data) => {
      refresh();
      setCheckedRowKeys(data?.failedIds);
      message.success(
        `Xoá thành công ${data?.totalDeleted}/${data?.totalRequested} ${name}`,
      );
      setOpen(false);
    },
    successMessage: "",
  });

  const handleDeleteAll = () => {
    callPostApi(bodyApi ? bodyApi : itemIds);
  };

  return (
    <>
      <Button danger onClick={() => setOpen(true)}>
        Xoá
      </Button>
      <AModal
        title={title}
        open={open}
        cancelText={"Hủy bỏ"}
        onCancel={() => setOpen(false)}
        okText={"Xác nhận"}
        onOk={handleDeleteAll}
        destroyOnHidden
      >
        <Typography.Text>
          {`Bạn có chắc chắn muốn ${title.toLowerCase()} đã chọn không?`}
        </Typography.Text>
      </AModal>
    </>
  );
};

export default memo(AMultiDeleteModal);
