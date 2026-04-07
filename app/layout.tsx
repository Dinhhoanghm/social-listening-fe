import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App } from "antd";
import { ThemeProvider } from "@/fe-global/themes";
import { ProviderRedux } from "@/app/stores/providers";
import { AppConfigProvider } from "@/fe-cores/components";
import { MessageProvider } from "@/fe-cores/components/MessageProvider";
import { appConfig } from "@/app/appConfig";
import themeConfig from "@/app/themeConfig";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thu thập dữ liệu",
  description:
    "Cấu hình nguồn HTTP, API, document và app — pipeline thu thập văn bản cho Topic Modelling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <AntdRegistry>
          <ThemeProvider theme={themeConfig}>
            <App>
            <MessageProvider>
              <ProviderRedux>
                <AppConfigProvider config={appConfig}>
                  {children}
                </AppConfigProvider>
              </ProviderRedux>
            </MessageProvider>
            </App>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
