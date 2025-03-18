import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // eslint: {
  //   // 在生产构建时忽略 ESLint 错误
  //   ignoreDuringBuilds: true,
  // },
  // output: 'standalone', // 生成独立部署包
  /* config options here */
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/ipfs/**",
      },
    ],
  },
};

export default nextConfig;
