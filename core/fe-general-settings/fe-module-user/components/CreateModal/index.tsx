import React, { useEffect, useState } from "react";
import { Button, Form, Input, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";

// Components
import AModal from "@/fe-component/AModal";
import { PositionSelect } from "@/fe-module-position/components/PositionSelect";
import BranchTreeSelect from "@/fe-module-branch/components/BranchTreeSelect";
import { SelectRole } from "@/fe-module-rbac/components/SelectRole";

// Apis
import { useApiPostMutation } from "@/fe-cores/hooks/useApiMutation";
import { useCreateUserMutation } from "../../apis";

// Reducer
import { authSelectors } from "@/fe-module-auth/reducers";

// Constants
import { CREATE_DATA } from "../../constants/data";
import { useMobile } from "@/fe-cores/common";
import { useSelector } from "react-redux";

interface Props {
  refresh: () => void;
}

function CreateModal(props: Props) {
  const isMobile = useMobile();
  const { refresh } = props;
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const me = useSelector(authSelectors.getMe);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open]);

  const { callPostApi: callCreateUser, isLoading } = useApiPostMutation({
    useMutationHook: useCreateUserMutation,
    onSuccess: () => {
      setOpen(false);
      form.resetFields();
      refresh();
    },
    successMessage: "Thêm người dùng thành công",
  });

  const handleSubmit = (values: any) => {
    callCreateUser(values);
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
      <AModal
        title="Thêm mới nhân viên"
        open={open}
        onCancel={onCancelModal}
        onOk={handleSubmit}
        footer={[
          <Button key="btn-cancel" onClick={onCancelModal}>
            Hủy
          </Button>,
          <Button
            key="btn-create-user"
            loading={isLoading}
            type="primary"
            form={"form-create-user"}
            htmlType="submit"
          >
            Tạo mới
          </Button>,
        ]}
        destroyOnClose
        centered
      >
        <Form
          form={form}
          id={"form-create-user"}
          onFinish={handleSubmit}
          initialValues={CREATE_DATA}
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
              {
                pattern: /^[a-zA-Z0-9\sÀ-ỹ\-_]+$/,
                message: "Chỉ được nhập chữ, số, khoảng trắng, dấu - hoặc _",
              },
            ]}
          >
            <Input
              placeholder="Nhập tài khoản"
              autoComplete="new-password"
            />
          </Form.Item>

          {/* <Form.Item
            name="code"
            label="Mã nhân viên"
            rules={[
              { required: true, message: "Vui lòng nhập mã nhân viên" },
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
            <Input placeholder="Nhập mã nhân viên" />
          </Form.Item> */}

          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { max: 255, message: "Không được nhập quá 255 ký tự" },
              { min: 7, message: "Mật khẩu phải nhất 7 ký tự" },
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
            <Input.Password
              allowClear={true}
              autoComplete="new-password"
              placeholder="Nhập mật khẩu"
            />
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
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9]+$/, message: "Không đúng định dạng số" },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="roleId"
            label="Quyền truy cập"
            rules={[{ required: true, message: "Chọn quyền truy cập" }]}
          >
            <SelectRole disabled={false} />
          </Form.Item>
        </Form>
      </AModal>
    </>
  );
}

export default CreateModal;
