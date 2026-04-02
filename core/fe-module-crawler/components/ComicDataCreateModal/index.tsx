import React, { memo, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Common
import { useMobile } from "@/fe-cores/common";

// Apis
import { useAddComicDataMutation } from "../../apis";
import { useApiPostMutation } from "@/fe-cores/hooks/useApiMutation";

// Constants
import { CREATE_COMIC_DATA } from "../../constants/data";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  onRefresh: () => void;
}

function ComicDataCreateModal(props: Props) {
  const isMobile = useMobile();
  const { onRefresh } = props;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { callPostApi, isLoading } = useApiPostMutation({
    useMutationHook: useAddComicDataMutation,
    onSuccess: () => {
      setOpen(false);
      form.resetFields();
      onRefresh();
    },
    successMessage: "Thêm dữ liệu truyện thành công!",
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
        title={"Thêm mới dữ liệu truyện"}
        open={open}
        onCancel={onCancelModal}
        onOk={handleSubmit}
        destroyOnClose
        width={700}
        footer={[
          <Button key="btn-cancel" onClick={onCancelModal}>
            Hủy
          </Button>,
          <Button
            key="btn-create-comic-data"
            loading={isLoading}
            type="primary"
            form={"form-create-comic-data"}
            htmlType="submit"
          >
            Tạo mới
          </Button>,
        ]}
        centered
      >
        <Form
          form={form}
          id={"form-create-comic-data"}
          onFinish={handleSubmit}
          initialValues={CREATE_COMIC_DATA}
          style={{ marginTop: "20px" }}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề" },
              { max: 500, message: "Không được nhập quá 500 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tiêu đề truyện" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { max: 2000, message: "Không được nhập quá 2000 ký tự" },
            ]}
          >
            <TextArea 
              placeholder="Nhập mô tả truyện" 
              rows={4}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="url"
            label="URL nguồn"
            rules={[
              { required: true, message: "Vui lòng nhập URL nguồn" },
              { max: 1000, message: "Không được nhập quá 1000 ký tự" },
              {
                pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                message: "URL không hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập URL nguồn" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="URL hình ảnh"
            rules={[
              { max: 1000, message: "Không được nhập quá 1000 ký tự" },
              {
                pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                message: "URL không hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái" },
            ]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="ongoing">Đang phát hành</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="hiatus">Tạm dừng</Option>
              <Option value="dropped">Bỏ</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default memo(ComicDataCreateModal);