import React, { memo } from "react";
import { Button, Form, Input, Modal, Select, Switch } from "antd";

// Apis
import { useUpdateComicDataMutation } from "../../apis";
import { useApiPutMutation } from "@/fe-cores/hooks/useApiMutation";
import { UPDATE_COMIC_DATA } from "../../constants/data";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  onRefresh: () => void;
  data: any;
  open: boolean;
  onCancelModal: () => void;
}

function ComicDataEditModal(props: Props) {
  const { open, onCancelModal, data, onRefresh } = props;
  const { callPutApi, isLoading } = useApiPutMutation({
    useMutationHook: useUpdateComicDataMutation,
    onSuccess: () => {
      onCancelModal();
      onRefresh();
    },
    successMessage: "Cập nhật dữ liệu truyện thành công!",
  });
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    callPutApi(
      {
        title: values.title,
        description: values.description,
        url: values.url,
        imageUrl: values.imageUrl,
        status: values.status,
        isActive: values.isActive,
      },
      { id: data.id }
    );
  };

  return (
    <Modal
      title={"Chỉnh sửa dữ liệu truyện"}
      open={open}
      onCancel={onCancelModal}
      destroyOnClose
      width={700}
      footer={[
        <Button key="btn-cancel" onClick={onCancelModal}>
          Hủy
        </Button>,
        <Button
          key="btn-edit-comic-data"
          loading={isLoading}
          type="primary"
          form={"form-edit-comic-data"}
          htmlType="submit"
        >
          Lưu
        </Button>,
      ]}
      centered
    >
      <Form
        id="form-edit-comic-data"
        form={form}
        onFinish={handleSubmit}
        initialValues={UPDATE_COMIC_DATA(data)}
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

        <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(ComicDataEditModal);