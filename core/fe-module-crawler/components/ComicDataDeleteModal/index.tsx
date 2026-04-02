import { memo } from "react";
import { Button, Modal, Typography } from "antd";

// Apis
import { useDeleteComicDataMutation } from "../../apis";
import { useApiDeleteMutation } from "@/fe-cores/hooks/useApiMutation";

// Constants
import { ComicData } from "../../constants/type";

const { Text } = Typography;

interface Props {
  open: boolean;
  onCancelMoal: () => void;
  onRefresh: () => void;
  data: ComicData;
}

function ComicDataDeleteModal(props: Props) {
  const { data, open, onCancelMoal, onRefresh } = props;

  const { callDeleteApi, isLoading } = useApiDeleteMutation({
    useMutationHook: useDeleteComicDataMutation,
    onSuccess: () => {
      onCancelMoal();
      onRefresh();
    },
    successMessage: "Xoá dữ liệu truyện thành công!",
  });

  const handleDeleteComicData = () => {
    callDeleteApi({ id: data?.id });
  };

  return (
    <Modal
      title={"Xóa dữ liệu truyện"}
      open={open}
      onCancel={onCancelMoal}
      destroyOnClose
      footer={[
        <Button onClick={onCancelMoal}>Hủy bỏ</Button>,
        <Button
          loading={isLoading}
          key={"argee"}
          type="primary"
          onClick={handleDeleteComicData}
        >
          Xác nhận
        </Button>,
      ]}
      centered
    >
      <Text>
        Bạn chắc chắn muốn xóa dữ liệu truyện: <Text type="danger">{data?.title}</Text>
      </Text>
    </Modal>
  );
}

export default memo(ComicDataDeleteModal);