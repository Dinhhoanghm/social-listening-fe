import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "antd",
    "@ant-design/icons",
    "@ant-design/nextjs-registry",
    "antd-style",
    "ahooks",
    "@rc-component",
  ],
};

export default nextConfig;
