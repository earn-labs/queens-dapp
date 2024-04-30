import { http, createConfig } from "@wagmi/core";
import { bsc, base } from "@wagmi/core/chains";
import { getDefaultConfig } from "connectkit";
import { cookieStorage, createStorage } from "wagmi";

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [bsc, base],
    transports: {
      // RPC URL for each chain
      [bsc.id]: http(`${process.env.NEXT_PUBLIC_RPC_BSC}`),
      [base.id]: http(`${process.env.NEXT_PUBLIC_RPC_BASE}`),
    },
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    appName: process.env.NEXT_PUBLIC_PROJECT_NAME as string,
    walletConnectProjectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,

    // Optional App Info
    appDescription: process.env.NEXT_PUBLIC_PROJECT_DESCRIPTION,
    appUrl: "https://0x52.buyholdearn.com", // your app's url
    appIcon: "https://0x52.buyholdearn.com/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);
