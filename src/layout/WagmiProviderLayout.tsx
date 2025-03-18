'use client'
import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import React from 'react';

import { config } from '@/wagmi';

const client = new QueryClient();

export default function WagmiProviderLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <WagmiProvider config={config}>
                <QueryClientProvider client={client}>
                    <RainbowKitProvider theme={darkTheme()}>
                        {children}
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </>
    );
}
