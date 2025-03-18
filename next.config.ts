import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 在生产构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  // output: 'standalone', // 生成独立部署包
  /* config options here */
};

export default nextConfig;
