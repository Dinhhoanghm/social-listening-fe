import React, { memo, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Common
import { useMobile } from "@/fe-cores/common";

// Apis
import { useAddCrawlerConfigMutation } from "../../apis";
import { useApiPostMutation } from "@/fe-cores/hooks/useApiMutation";

// Constants
import { CREATE_CRAWLER_CONFIG_DATA } from "../../constants/data";

interface Props {
  onRefresh: () => void;
}

function CreateModal(props: Props) {
  const isMobile = useMobile();
  const { onRefresh } = props;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { callPostApi, isLoading } = useApiPostMutation({
    useMutationHook: useAddCrawlerConfigMutation,
    onSuccess: () => {
      setOpen(false);
      form.resetFields();
      onRefresh();
    },
    successMessage: "Thêm cấu hình cào thành công!",
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
        title={"Thêm mới cấu hình cào"}
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
            key="btn-create-crawler-config"
            loading={isLoading}
            type="primary"
            form={"form-create-crawler-config"}
            htmlType="submit"
          >
            Tạo mới
          </Button>,
        ]}
        centered
      >
        <Form
          form={form}
          id={"form-create-crawler-config"}
          onFinish={handleSubmit}
          initialValues={CREATE_CRAWLER_CONFIG_DATA}
          style={{ marginTop: "20px" }}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên cấu hình"
            rules={[
              { required: true, message: "Vui lòng nhập tên cấu hình" },
              { max: 100, message: "Không được nhập quá 100 ký tự" },
              {
                pattern: /^[a-zA-Z0-9\sÀ-ỹ\-_]+$/,
                message: "Chỉ được nhập chữ, số, khoảng trắng, dấu - hoặc _",
              },
              () => ({
                validator(_, value) {
                  if (value && value.startsWith(" ")) {
                    return Promise.reject("Không được nhập dấu cách đầu tiên");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Nhập tên cấu hình" />
          </Form.Item>

          <Form.Item
            name="url"
            label="URL nguồn"
            rules={[
              { required: true, message: "Vui lòng nhập URL nguồn" },
              { max: 300, message: "Không được nhập quá 300 ký tự" },
              {
                pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                message: "URL không hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập URL nguồn" />
          </Form.Item>

          <Form.Item
            name="frequencyHour"
            label="Tần suất cào dữ liệu (giờ)"
            rules={[
              { type: 'number', min: 1, message: 'Tần suất phải lớn hơn 0' }
            ]}
          >
            <InputNumber 
              placeholder="Nhập tần suất (giờ)" 
              min={1}
              max={100}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="crawlerType"
            label="Loại crawler"
            rules={[
              { required: true, message: "Vui lòng chọn loại crawler" }
            ]}
          >
            <Select placeholder="Chọn loại crawler">
              <Select.Option value="WEB">WEB</Select.Option>
              <Select.Option value="DOUCUMENT">DOUCUMENT</Select.Option>
              <Select.Option value="API">API</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="storyType"
            label="Loại truyện"
            rules={[
              { required: true, message: "Vui lòng chọn loại truyện" }
            ]}
          >
            <Select placeholder="Chọn loại truyện">
              <Select.Option value="comic">Truyện tranh</Select.Option>
              <Select.Option value="novel">Truyện chữ</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default memo(CreateModal);