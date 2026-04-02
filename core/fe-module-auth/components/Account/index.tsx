"use client";
import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Avatar, Dropdown, Flex, Typography } from "antd";
import Image from "next/image";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  DownOutlined,
  KeyOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { authSelectors } from "../../reducers";
import { useResponsive } from "ahooks";

import avatar from "@/public/avatar.jpg";
import ProfileModal from "../ProfileModal";
import PasswordChange from "../PasswordChange";

const { Text } = Typography;

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "Thông tin cá nhân",
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: "Đổi mật khẩu",
    icon: <KeyOutlined />,
  },
  {
    key: "3",
    label: "Đăng xuất",
    icon: <LogoutOutlined />,
  },
];

const Account: React.FC = () => {
  const router = useRouter();
  const me = useSelector(authSelectors.getMe);
  const { sm } = useResponsive();
  const [isInfoModal, setIsInfoModal] = useState(false);
  const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);

  const onClick = (event) => {
    if (event.key === "3") {
      deleteCookie("token");
      deleteCookie("refeshToken");
      router.refresh();
    }

    if (event.key === "1") {
      setIsInfoModal(true);
    }

    if (event.key === "2") {
      setIsChangePasswordModal(true);
    }
  };

  return (
    <>
      <Dropdown menu={{ items, onClick }} placement="bottomRight">
        <Flex align="center" gap={8} style={{ height: "100%" }}>
          <Avatar src={me?.avatar} size={32} icon={<UserOutlined />} />
          {sm && <Text>{me?.fullName}</Text>}
          <DownOutlined />
        </Flex>
      </Dropdown>
      {isInfoModal && (
        <ProfileModal
          visible={isInfoModal}
          onClose={() => setIsInfoModal(false)}
        />
      )}
      {isChangePasswordModal && (
        <PasswordChange
          visible={isChangePasswordModal}
          onCancelModal={() => setIsChangePasswordModal(false)}
        />
      )}
    </>
  );
};

export default Account;
