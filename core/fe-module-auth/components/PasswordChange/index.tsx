import React from "react";
import { Form, Input, Button, Modal, Space, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useChangePasswordMutation } from "../../apis";
import { useApiPostMutation } from "@/fe-cores/hooks/useApiMutation";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

const { Text } = Typography;

const PasswordChange = (props) => {
  const router = useRouter();
  const { visible, onCancelModal } = props;
  const [form] = Form.useForm();
  const { callPostApi, isLoading, isSuccess } = useApiPostMutation({
    useMutationHook: useChangePasswordMutation,
    onSuccess: () => {
      deleteCookie("token");
      deleteCookie("refeshToken");
    },
    successMessage: "",
  });

  const handleSubmit = (values) => {
    console.log("Form values:", values);
    callPostApi({ password: values.password, newPassword: values.newPassword });
  };

  const onLogin = () => {
    router.refresh();
    onCancelModal();
  };

  if (isSuccess) {
    return (
      <Modal
        title="Thông báo"
        open={visible}
        closable={false}
        centered
        footer={[
          <Button key={"login"} onClick={onLogin} type="primary">
            Đăng nhập
          </Button>,
        ]}
        width={400}
      >
        <Text>
          Đổi mật khẩu thành công! Hệ thống đã tự động thoát hết các phần mềm.
          Vui lòng đăng nhập lại bằng mật khẩu mới để tiếp tục sử dụng.
        </Text>
      </Modal>
    );
  }

  return (
    <Modal
      title="Đổi mật khẩu"
      open={visible}
      onCancel={onCancelModal}
      footer={null}
      centered
      width={400}
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label={"Mật khẩu cũ"}
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu cũ" },
            { min: 7, message: "Mật khẩu ít nhất có 7 ký tự" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu cũ"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label={"Mật khẩu mới"}
          name="newPassword"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 7, message: "Mật khẩu ít nhất có 7 ký tự" },
          ]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu mới"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          label={"Nhập lại mật khẩu mới"}
          name="confirmPassword"
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu nhập lại không khớp")
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Nhập lại mật khẩu mới"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={onCancelModal}>Đóng</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Lưu lại
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordChange;
