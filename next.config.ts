import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns: [
      {
        protocol: 'https', // 指定协议
        hostname: 'utfs.io', // 指定允许的图片主机域名
        // port: '', // 端口通常留空
        // pathname: '/**', // 如需限制路径可配置，留空或使用'/**'表示允许所有路径
      },
      // 您可以在此继续添加其他允许的远程图片源
    ],
  }
};

export default nextConfig;
