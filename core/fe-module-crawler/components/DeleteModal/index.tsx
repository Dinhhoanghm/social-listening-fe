import { memo } from "react";
import { Button, Modal, Typography } from "antd";

// Apis
import { useDeleteCrawlerConfigMutation } from "../../apis";
import { useApiDeleteMutation } from "@/fe-cores/hooks/useApiMutation";

// Constants
import { CrawlerConfig } from "../../constants/type";

const { Text } = Typography;

interface Props {
  open: boolean;
  onCancelMoal: () => void;
  onRefresh: () => void;
  data: CrawlerConfig;
}

function DeleteModal(props: Props) {
  const { data, open, onCancelMoal, onRefresh } = props;

  const { callDeleteApi, isLoading } = useApiDeleteMutation({
    useMutationHook: useDeleteCrawlerConfigMutation,
    onSuccess: () => {
      onCancelMoal();
      onRefresh();
    },
    successMessage: "Xoá cấu hình cào thành công!",
  });

  const handleDeleteCrawlerConfig = () => {
    callDeleteApi({ id: data?.id });
  };

  return (
    <Modal
      title={"Xóa cấu hình cào"}
      open={open}
      onCancel={onCancelMoal}
      destroyOnClose
      footer={[
        <Button onClick={onCancelMoal}>Hủy bỏ</Button>,
        <Button
          loading={isLoading}
          key={"argee"}
          type="primary"
          onClick={handleDeleteCrawlerConfig}
        >
          Xác nhận
        </Button>,
      ]}
      centered
    >
      <Text>
        Bạn chắc chắn muốn xóa cấu hình cào: <Text type="danger">{data?.name}</Text>
      </Text>
    </Modal>
  );
}

export default memo(DeleteModal);