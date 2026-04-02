import React, { memo, useState } from "react";
import { Button, Form, Input, Modal, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Common
import { useMobile } from "@/fe-cores/common";

// Apis
import { useAddCrawledComicMutation } from "../../apis";
import { useApiPostMutation } from "@/fe-cores/hooks/useApiMutation";

// Constants
import { CREATE_CRAWLED_COMIC_DATA } from "../../constants/data";

interface Props {
  onRefresh: () => void;
}

function CrawledComicCreateModal(props: Props) {
  const isMobile = useMobile();
  const { onRefresh } = props;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { callPostApi, isLoading } = useApiPostMutation({
    useMutationHook: useAddCrawledComicMutation,
    onSuccess: () => {
      setOpen(false);
      form.resetFields();
      onRefresh();
    },
    successMessage: "Thêm truyện đã cào thành công!",
  });

  const handleSubmit = (data: any) => {
    callPostApi(data);
  };

  const onCancelModal = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        type="primary"
        icon={<PlusOutlined />}
      >
        {!isMobile ? "Thêm mới" : ""}
      </Button>
      <Modal
        title={"Thêm mới truyện đã cào"}
        open={open}
        onCancel={onCancelModal}
        onOk={handleSubmit}
        destroyOnClose
        width={600}
        footer={[
          <Button key="btn-cancel" onClick={onCancelModal}>
            Hủy
          </Button>,
          <Button
            key="btn-create-crawled-comic"
            loading={isLoading}
            type="primary"
            form={"form-create-crawled-comic"}
            htmlType="submit"
          >
            Tạo mới
          </Button>,
        ]}
        centered
      >
        <Form
          form={form}
          id={"form-create-crawled-comic"}
          onFinish={handleSubmit}
          initialValues={CREATE_CRAWLED_COMIC_DATA}
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
        </Form>
      </Modal>
    </>
  );
}

export default memo(CrawledComicCreateModal);