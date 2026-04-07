"use client";

import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { setItemsMenu } from "@/fe-cores/reducers";
import { Flex } from "antd";
import { useResponsivePadding } from "@/fe-cores/hooks";
import { LayoutBase, useLayoutBase } from "@/fe-cores/layouts";
import {
  CodeOutlined,
  DatabaseOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const menuItems = [
  {
    key: "crawler-config",
    label: "Cấu hình crawler",
    icon: <DatabaseOutlined />,
    link: "/crawler/config",
  },
  {
    key: "crawler-sources",
    label: "Nguồn dữ liệu",
    icon: <GlobalOutlined />,
    link: "/crawler/sources",
  },
  {
    key: "crawler-scripts",
    label: "Script tùy chỉnh",
    icon: <CodeOutlined />,
    link: "/crawler/scripts",
  },
];

export default function LayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { layoutMode, collapsedSider, footer, isPageTab } = useLayoutBase();
  const padding = useResponsivePadding();

  useLayoutEffect(() => {
    dispatch(setItemsMenu(menuItems));
  }, []);

  return (
    <LayoutBase
      layoutMode={layoutMode}
      collapsedSider={collapsedSider}
      footer={footer}
      isPageTab={isPageTab}
    >
      <Flex vertical style={{ padding, height: "100%" }}>
        {children}
      </Flex>
    </LayoutBase>
  );
}
