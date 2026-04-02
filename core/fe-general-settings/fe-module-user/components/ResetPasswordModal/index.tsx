import { Button, Flex, Form, Typography } from "antd";
import { useState } from "react";
import generatePassword from "generate-password";

// Components
import { useApiPostMutation } from "@/fe-cores/hooks/useApiMutation";
import AModal from "@/fe-component/AModal";

// Apis
import { useResetPassUserMutation } from "../../apis";

// Constants
import { User } from "../../constants/type";

const { Text } = Typography;

interface Props {
  data: User;
  open: boolean;
  onCancelModal: () => void;
  refresh: () => void;
}

function ResetPasswordModal(props: Props) {
  const { data, open, onCancelModal, refresh } = props;
  const [form] = Form.useForm();
  const [successVisible, setSuccessVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const { callPostApi, isLoading } = useApiPostMutation({
    useMutationHook: useResetPassUserMutation,
    onSuccess: () => {
      onCancelModal();
      refresh();
      setSuccessVisible(true);
    },
    successMessage: "Cập nhật lại mật khẩu người dùng thành công!",
  });

  const handleSubmit = async () => {
    const comfirmNewPassword = generatePassword.generate({
      length: 10,
      numbers: true,
      uppercase: true,
      lowercase: true,
    });
    setNewPassword(comfirmNewPassword);
    callPostApi({
      id: data?.id,
      newPassword: comfirmNewPassword,
    });
    onCancelModal();
  };

  const onCancel = () => {
    onCancelModal();
    form.resetFields();
  };

  return (
    <>
      {/* Modal xác nhận */}
      <AModal
        title="Reset mật khẩu?"
        open={open}
        onCancel={onCancel}
        onOk={handleSubmit}
        footer={[
          <Button key="btn-cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button
            key="btn-reset-user"
            loading={isLoading}
            type="primary"
            form={"form-reset-user"}
            htmlType="submit"
          >
            Xác nhận
          </Button>,
        ]}
        centered
      >
        <Form
          form={form}
          id="form-reset-user"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Text>
            Bạn có chắc chắn muốn reset mật khẩu tài khoản{" "}
            <Text type="danger">{data?.username}</Text>
          </Text>
        </Form>
      </AModal>

      {/* Modal thành công */}
      <AModal
        title="Reset mật khẩu thành công"
        open={successVisible}
        onCancel={() => setSuccessVisible(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setSuccessVisible(false)}
          >
            Đóng
          </Button>,
        ]}
      >
        <Flex vertical>
          <Text>
            Dưới đây là mật khẩu mới của tài khoản{" "}
            <Text type="danger">{data?.username}</Text>:{" "}
          </Text>
          <Text
            copyable={{
              text: async () =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(newPassword);
                  }, 500);
                }),
            }}
          >
            **********
          </Text>
        </Flex>
      </AModal>
    </>
  );
}

export default ResetPasswordModal;
