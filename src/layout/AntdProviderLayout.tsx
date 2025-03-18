"use client";
import { message, ConfigProvider, App } from "antd";
import { ReactNode, useEffect } from "react";

interface AntdProviderLayoutProps {
  children: ReactNode;
}

const AntdProviderLayout = ({ children }: AntdProviderLayoutProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    window.$message = messageApi;
  }, []);

  return (
    <ConfigProvider>
      <App>
        {contextHolder}
        {children}
      </App>
    </ConfigProvider>
  );
};

export default AntdProviderLayout;
