"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  Flex,
  Avatar,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";

// Components
import AModal from "@/fe-component/AModal";
import { useApiPutMutation } from "@/fe-cores/hooks/useApiMutation";
import { useLazyGetMeAuthQuery, useUpdateMeAuthMutation } from "../../apis";
import { useTheme } from "antd-style";
import { useSelector } from "react-redux";
import { authSelectors } from "../../reducers";
import { getToken } from "@/fe-base/utils/getToken";

const { Text } = Typography;

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  // onUpdateProfile: (data: UserProfile) => Promise<void>;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
  // onUpdateProfile,
}) => {
  const [form] = Form.useForm();
  const token = useTheme();
  const auth = getToken();
  const data = useSelector(authSelectors.getMe);
  const [avatar, setAvatar] = useState<string>(data?.avatar);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [getMeAuth] = useLazyGetMeAuthQuery({});
  const { callPutApi, isLoading } = useApiPutMutation({
    useMutationHook: useUpdateMeAuthMutation,
    onSuccess: () => {
      setIsEditing(false);
      getMeAuth();
    },
    successMessage: "Chỉnh sửa thông tin thành công!",
  });

  // Reset form khi data thay đổi
  useEffect(() => {
    if (visible) {
      form.setFieldsValue(data);
    }
  }, [visible, data, form]);

  // Reset trạng thái khi đóng modal
  useEffect(() => {
    if (!visible) {
      setIsEditing(false);
    }
  }, [visible]);

  // Xử lý upload ảnh
  const props: UploadProps = {
    name: "file",
    action: `${process.env.URL_SERVER}${process.env.AUTH_URL_UPLOAD_AVATAR}`,
    data: {
      userId: data?.id, // This will be included as form data
    },
    headers: {
      Authorization: `Bearer ${auth}`,
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        setLoading(true);
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        setLoading(false);
        const url = info.file.response.data.path;
        setAvatar(url);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // Xử lý lưu thông tin
  const handleSave = async () => {
    const values = await form.validateFields();
    callPutApi({
      avatar: avatar,
      email: values?.email,
      fullName: values?.fullName,
      phoneNumber: values?.phoneNumber || null,
    });
  };

  // Xử lý cancel
  const handleCancel = () => {
    if (isEditing) {
      // Quay lại chế độ xem
      form.setFieldsValue(data);
      // setAvatar(data.avatar);
      setIsEditing(false);
    } else {
      // Đóng modal
      onClose();
    }
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </button>
  );

  return (
    <AModal
      title="Thông tin cá nhân"
      open={visible}
      onCancel={onClose}
      width={500}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {isEditing ? "Huỷ" : "Đóng"}
        </Button>,
        <Button
          key="edit"
          type="primary"
          loading={isLoading}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? "Lưu lại" : "Chỉnh sửa"}
        </Button>,
      ]}
    >
      <Flex vertical align="center" style={{ marginBottom: 24 }} gap={16}>
        {isEditing ? (
          <Upload
            name="avatar"
            listType="picture-circle"
            // className="avatar-uploader"
            showUploadList={false}
            {...props}
          >
            <Flex vertical style={{ position: "relative" }}>
              <Avatar
                size={80}
                src={avatar}
                style={{ background: token["blue-1"] }}
                icon={<UserOutlined style={{ color: "#1890ff" }} />}
              />
              {uploadButton}
            </Flex>
          </Upload>
        ) : (
          <Avatar
            size={100}
            src={avatar}
            style={{ background: token["blue-1"] }}
            icon={<UserOutlined style={{ color: "#1890ff" }} />}
          />
        )}

        {isEditing && (
          <>
            <Text type="secondary">
              Chỉ tải định dạng JPG, GIF hoặc PNG.
            </Text>
          </>
        )}
      </Flex>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          email: data?.email,
          fullName: data?.fullName,
          phoneNumber: data?.phoneNumber || null,
        }}
      >
        <Form.Item label="Tài khoản" name="username">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[
            {
              pattern: /^[0-9]{10,11}$/,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>
      </Form>
    </AModal>
  );
};

export default ProfileModal;
