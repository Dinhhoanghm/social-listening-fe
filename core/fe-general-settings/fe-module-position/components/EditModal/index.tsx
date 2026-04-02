import React, { memo } from "react";
import { Button, Form, Input, Modal, Switch } from "antd";

// Apis
import { useUpdatePositionMutation } from "../../apis";
import { useApiPutMutation } from "@/fe-cores/hooks/useApiMutation";
import { UPDATE_DATA } from "../../constants/data";

interface Props {
  onRefresh: () => void;
  data: any;
  open: boolean;
  onCancelModal: () => void;
}

function EditModal(props: Props) {
  const { open, onCancelModal, data, onRefresh } = props;
  const { callPutApi, isLoading } = useApiPutMutation({
    useMutationHook: useUpdatePositionMutation,
    onSuccess: () => {
      onCancelModal();
      onRefresh();
    },
    successMessage: "Cập nhật chức vụ thành công!",
  });
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    callPutApi(
      {
        code: values.code,
        name: values.name,
        isActive: values.isActive,
      },
      { id: data.id }
    );
  };

  return (
    <Modal
      title={"Chỉnh sửa chức vụ"}
      open={open}
      onCancel={onCancelModal}
      destroyOnClose
      width={448}
      footer={[
        <Button key="btn-cancel" onClick={onCancelModal}>
          Hủy
        </Button>,
        <Button
          key="btn-edit-positon"
          loading={isLoading}
          type="primary"
          form={"form-edit-positon"}
          htmlType="submit"
        >
          Lưu
        </Button>,
      ]}
      centered
    >
      <Form
        id="form-edit-positon"
        form={form}
        onFinish={handleSubmit}
        initialValues={UPDATE_DATA(data)}
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
            { required: true, message: "Vui lòng nhập tên chức vụ" },
            {
              pattern: /^[a-zA-Z0-9\sÀ-ỹ\-_]+$/,
              message: "Chỉ được nhập chữ, số, khoảng trắng, dấu - hoặc _",
            },
            { max: 255, message: "Không được nhập quá 255 ký tự" },
          ]}
        >
          <Input placeholder="Nhập tên chức vụ" />
        </Form.Item>
        <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(EditModal);
