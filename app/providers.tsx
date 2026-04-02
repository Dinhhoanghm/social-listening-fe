"use client";

import { App, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import type { ReactNode } from "react";
import ReduxProvider from "@/components/providers/ReduxProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider>
      <ConfigProvider
        locale={viVN}
        theme={{
          token: {
            colorPrimary: "#52c41a",
            borderRadius: 6,
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </ReduxProvider>
  );
}
