import { Button, Form, Input, Switch } from "antd";
import React from "react";

// Components
import { PositionSelect } from "@/fe-module-position/components/PositionSelect";
import AModal from "@/fe-component/AModal";
import BranchTreeSelect from "@/fe-module-branch/components/BranchTreeSelect";
import { SelectRole } from "@/fe-module-rbac/components/SelectRole";

// Apis
import { useApiPutMutation } from "@/fe-cores/hooks/useApiMutation";
import { useUpdateUserMutation } from "../../apis";

// Constants
import { User } from "../../constants/type";
import { UPDATE_DATA } from "../../constants/data";

interface Props {
  data: User;
  open: boolean;
  onCancelModal: () => void;
  refresh: () => void;
  isDisabled: boolean;
  title: string;
}

function EditModal(props: Props) {
  const { data, open, onCancelModal, isDisabled, refresh, title } = props;
  const [form] = Form.useForm();

  // call api
  const { callPutApi, isLoading } = useApiPutMutation({
    useMutationHook: useUpdateUserMutation,
    onSuccess: () => {
      onCancelModal();
      refresh();
    },
    successMessage: "Cập nhật người dùng thành công!",
  });

  // hàm xử lý
  const handleSubmit = (values: any) => {
    callPutApi(values, { id: data?.id });
  };

  return (
    <>
      <AModal
        title={title}
        open={open}
        onCancel={onCancelModal}
        onOk={handleSubmit}
        footer={
          isDisabled
            ? [
                <Button key="btn-cancel" onClick={onCancelModal}>
                  Đóng
                </Button>,
              ]
            : [
                <Button key="btn-cancel" onClick={onCancelModal}>
                  Hủy
                </Button>,
                <Button
                  key="btn-edit-user"
                  loading={isLoading}
                  type="primary"
                  form={"form-edit-user"}
                  htmlType="submit"
                >
                  {isDisabled ? "Chỉnh sửa" : "Lưu"}
                </Button>,
              ]
        }
        centered
      >
        <Form
          id="form-edit-user"
          form={form}
          initialValues={UPDATE_DATA(data)}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="Tài khoản"
            rules={[
              { required: true, message: "Vui lòng nhập tài khoản" },
              { max: 255, message: "Không được nhập quá 255 ký tự" },
              () => ({
                validator(_, value) {
                  if (value && value.trim().length === 0) {
                    return Promise.reject("Không được nhập toàn khoảng trắng");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Nhập username" disabled={true} />
          </Form.Item>

          {/* <Form.Item
            name="code"
            label="Mã nhân viên"
            rules={[
              { required: true, message: "Vui lòng nhập mã nhân viên" },
              { max: 10, message: "Không được nhập quá 10 ký tự" },
              () => ({
                validator(_, value) {
                  if (value && value.startsWith(" ")) {
                    return Promise.reject("Không được nhập dấu cách đầu tiên");
                  }
                  return Promise.resolve();
                },
              }),
              () => ({
                validator(_, value) {
                  if (value && value.trim().length === 0) {
                    return Promise.reject("Không được nhập toàn khoảng trắng");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Nhập mã nhân viên" disabled={true} />
          </Form.Item> */}

          <Form.Item name="fullName" label="Họ và tên">
            <Input placeholder="Nhập đầy đủ họ và tên" disabled={isDisabled} />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { max: 255, message: "Không được nhập quá 255 ký tự" },
              { type: "email", message: "Email không hợp lệ" },
              () => ({
                validator(_, value) {
                  if (value && value.trim().length === 0) {
                    return Promise.reject("Không được nhập toàn khoảng trắng");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Nhập email" disabled={isDisabled} />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9]+$/, message: "Không đúng định dạng số" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" disabled={isDisabled} />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Quyền truy cập"
            rules={[{ required: true, message: "Chọn quyền truy cập" }]}
          >
            <SelectRole disabled={isDisabled} />
          </Form.Item>
        </Form>
      </AModal>
    </>
  );
}

export default EditModal;
