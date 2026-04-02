import React, { memo, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Common
import { useMobile } from "@/fe-cores/common";

// Apis
import { useAddPositionMutation } from "../../apis";
import { useApiPostMutation } from "@/fe-cores/hooks/useApiMutation";

// Constants
import { CREATE_DATA } from "../../constants/data";

interface Props {
  onRefresh: () => void;
}

function CreateModal(props: Props) {
  const isMobile = useMobile();
  const { onRefresh } = props;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { callPostApi, isLoading } = useApiPostMutation({
    useMutationHook: useAddPositionMutation,
    onSuccess: () => {
      setOpen(false);
      form.resetFields();
      onRefresh();
    },
    successMessage: "Thêm chức vụ thành công!",
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
        title={"Thêm mới chức vụ"}
        open={open}
        onCancel={onCancelModal}
        onOk={handleSubmit}
        destroyOnClose
        width={448}
        footer={[
          <Button key="btn-cancel" onClick={onCancelModal}>
            Hủy
          </Button>,
          <Button
            key="btn-create-positon"
            loading={isLoading}
            type="primary"
            form={"form-create-positon"}
            htmlType="submit"
          >
            Tạo mới
          </Button>,
        ]}
        centered
      >
        <Form
          form={form}
          id={"form-create-positon"}
          onFinish={handleSubmit}
          initialValues={CREATE_DATA}
          style={{ marginTop: "20px" }}
          layout="vertical"
        >
          <Form.Item
            name="code"
            label="Mã chức vụ"
            rules={[
              { required: true, message: "Vui lòng nhập mã chức vụ" },
              { max: 10, message: "Không được nhập quá 10 ký tự" },
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
            <Input placeholder="Nhập mã chức vụ" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên chức vụ"
            rules={[
              {
                pattern: /^[a-zA-Z0-9\sÀ-ỹ\-_]+$/,
                message: "Chỉ được nhập chữ, số, khoảng trắng, dấu - hoặc _",
              },
              { required: true, message: "Vui lòng nhập tên chức vụ" },
              { max: 255, message: "Không được nhập quá 255 ký tự" },
            ]}
          >
            <Input placeholder="Nhập tên chức vụ" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default memo(CreateModal);
