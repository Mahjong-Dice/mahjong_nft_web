'use client'
import '@/styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';

import { config } from '@/wagmi';
import React from 'react';

const client = new QueryClient();

export default function WagmiProviderLayout({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config} reconnectOnMount>
            <QueryClientProvider client={client}>
                <RainbowKitProvider theme={darkTheme()}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
