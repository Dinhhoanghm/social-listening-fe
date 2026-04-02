import { memo } from "react";
import { Button, Modal, Typography } from "antd";

// Apis
import { useDeleteCrawledComicMutation } from "../../apis";
import { useApiDeleteMutation } from "@/fe-cores/hooks/useApiMutation";

// Constants
import { CrawledComic } from "../../constants/type";

const { Text } = Typography;

interface Props {
  open: boolean;
  onCancelMoal: () => void;
  onRefresh: () => void;
  data: CrawledComic;
}

function CrawledComicDeleteModal(props: Props) {
  const { data, open, onCancelMoal, onRefresh } = props;

  const { callDeleteApi, isLoading } = useApiDeleteMutation({
    useMutationHook: useDeleteCrawledComicMutation,
    onSuccess: () => {
      onCancelMoal();
      onRefresh();
    },
    successMessage: "Xoá truyện đã cào thành công!",
  });

  const handleDeleteCrawledComic = () => {
    callDeleteApi({ id: data?.id });
  };

  return (
    <Modal
      title={"Xóa truyện đã cào"}
      open={open}
      onCancel={onCancelMoal}
      destroyOnClose
      footer={[
        <Button onClick={onCancelMoal}>Hủy bỏ</Button>,
        <Button
          loading={isLoading}
          key={"argee"}
          type="primary"
          onClick={handleDeleteCrawledComic}
        >
          Xác nhận
        </Button>,
      ]}
      centered
    >
      <Text>
        Bạn chắc chắn muốn xóa chương: <Text type="danger">{data?.chapterTitle}</Text> (Chương {data?.chapterNumber})
      </Text>
    </Modal>
  );
}

export default memo(CrawledComicDeleteModal);