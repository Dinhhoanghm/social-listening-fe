import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cấu hình crawler",
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
          <Providers>{children}</Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
