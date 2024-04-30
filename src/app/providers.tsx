"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, cookieToInitialState, createConfig, http } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { base, bsc } from 'wagmi/chains';
import { config } from '@/lib/config';
import CustomAvatar from '@/components/customAvatar';

const queryClient = new QueryClient()

export function Providers({ children, cookie }: { children: React.ReactNode, cookie: string | null }) {
    const initialState = cookieToInitialState(config, cookie);
    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider theme="midnight" options={{
                    customAvatar: CustomAvatar,
                }}>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}