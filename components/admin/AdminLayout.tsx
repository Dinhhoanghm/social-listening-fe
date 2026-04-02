"use client";

import {
  Breadcrumb,
  Layout,
  Menu,
  theme as antdTheme,
  Typography,
} from "antd";
import {
  CodeOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, type ReactNode } from "react";

const { Header, Sider, Content } = Layout;

const appTitle =
  process.env.NEXT_PUBLIC_APP_TITLE?.trim() || "Thu thập dữ liệu";

const menuItems = [
  {
    key: "crawler-config",
    icon: <DatabaseOutlined />,
    label: <Link href="/crawler/config">Cấu hình crawler</Link>,
  },
  {
    key: "crawler-sources",
    icon: <GlobalOutlined />,
    label: <Link href="/crawler/sources">Nguồn dữ liệu</Link>,
  },
  {
    key: "crawler-scripts",
    icon: <CodeOutlined />,
    label: <Link href="/crawler/scripts">Script tùy chỉnh</Link>,
  },
];

export default function AdminLayout({
  breadcrumbItems,
  children,
}: {
  breadcrumbItems: { title: ReactNode }[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { token } = antdTheme.useToken();

  const selectedKeys = useMemo(() => {
    if (!pathname) return [];
    if (pathname.startsWith("/crawler/sources")) return ["crawler-sources"];
    if (pathname.startsWith("/crawler/scripts")) return ["crawler-scripts"];
    if (pathname.startsWith("/crawler/config")) return ["crawler-config"];
    return [];
  }, [pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        theme="light"
        style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Typography.Title level={5} style={{ margin: 0 }}>
            {appTitle}
          </Typography.Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
          style={{ borderInlineEnd: "none" }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: token.colorBgContainer,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Breadcrumb
            items={[
              {
                title: (
                  <Link href="/crawler/config" aria-label="Trang chỉnh crawler">
                    <HomeOutlined />
                  </Link>
                ),
              },
              ...breadcrumbItems,
            ]}
          />
        </Header>
        <Content style={{ margin: 24, minHeight: 360 }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
