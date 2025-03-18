'use client'
import { message, ConfigProvider } from 'antd';
import { ReactNode, useEffect } from 'react';


interface AntdProviderLayoutProps {
    children: ReactNode;
}

const AntdProviderLayout = ({ children }: AntdProviderLayoutProps) => {
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        window.$message = messageApi;
    }, [])

    return <ConfigProvider>
        {contextHolder}
        {children}
    </ConfigProvider>;
};

export default AntdProviderLayout;