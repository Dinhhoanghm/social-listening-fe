import React, { memo } from "react";
import { Button, Form, Input, Modal, InputNumber, Switch } from "antd";

// Apis
import { useUpdateCrawledComicMutation } from "../../apis";
import { useApiPutMutation } from "@/fe-cores/hooks/useApiMutation";
import { UPDATE_CRAWLED_COMIC_DATA } from "../../constants/data";

interface Props {
  onRefresh: () => void;
  data: any;
  open: boolean;
  onCancelModal: () => void;
}

function CrawledComicEditModal(props: Props) {
  const { open, onCancelModal, data, onRefresh } = props;
  const { callPutApi, isLoading } = useApiPutMutation({
    useMutationHook: useUpdateCrawledComicMutation,
    onSuccess: () => {
      onCancelModal();
      onRefresh();
    },
    successMessage: "Cập nhật truyện đã cào thành công!",
  });
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    callPutApi(
      {
        comicId: values.comicId,
        chapterNumber: values.chapterNumber,
        chapterTitle: values.chapterTitle,
        chapterUrl: values.chapterUrl,
        isActive: values.isActive,
      },
      { id: data.id }
    );
  };

  return (
    <Modal
      title={"Chỉnh sửa truyện đã cào"}
      open={open}
      onCancel={onCancelModal}
      destroyOnClose
      width={600}
      footer={[
        <Button key="btn-cancel" onClick={onCancelModal}>
          Hủy
        </Button>,
        <Button
          key="btn-edit-crawled-comic"
          loading={isLoading}
          type="primary"
          form={"form-edit-crawled-comic"}
          htmlType="submit"
        >
          Lưu
        </Button>,
      ]}
      centered
    >
      <Form
        id="form-edit-crawled-comic"
        form={form}
        onFinish={handleSubmit}
        initialValues={UPDATE_CRAWLED_COMIC_DATA(data)}
        style={{ marginTop: "20px" }}
        layout="vertical"
      >
        <Form.Item
          name="comicId"
          label="ID truyện"
          rules={[
            { required: true, message: "Vui lòng nhập ID truyện" },
            { type: "number", message: "ID truyện phải là số" },
          ]}
        >
          <InputNumber 
            placeholder="Nhập ID truyện" 
            style={{ width: "100%" }}
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="chapterNumber"
          label="Số chương"
          rules={[
            { required: true, message: "Vui lòng nhập số chương" },
            { type: "number", message: "Số chương phải là số" },
          ]}
        >
          <InputNumber 
            placeholder="Nhập số chương" 
            style={{ width: "100%" }}
            min={0}
            step={0.01}
          />
        </Form.Item>

        <Form.Item
          name="chapterTitle"
          label="Tiêu đề chương"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề chương" },
            { max: 255, message: "Không được nhập quá 255 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tiêu đề chương" />
        </Form.Item>

        <Form.Item
          name="chapterUrl"
          label="URL chương"
          rules={[
            { required: true, message: "Vui lòng nhập URL chương" },
            { max: 500, message: "Không được nhập quá 500 ký tự" },
            {
              pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
              message: "URL không hợp lệ",
            },
          ]}
        >
          <Input placeholder="Nhập URL chương" />
        </Form.Item>

        <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(CrawledComicEditModal);