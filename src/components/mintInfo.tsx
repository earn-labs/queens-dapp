import Image from "next/image";
import MintButton from "./mintButton";
import { sourceMinterABI } from "@/assets/sourceMinterABI";
import { base, bsc } from "wagmi/chains";
import { config } from "@/lib/config";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import { useReadContract } from "wagmi";
import { nftABI } from "@/assets/nftABI";

const SOURCE_MINTER_CONTRACT = process.env.NEXT_PUBLIC_SOURCE_MINTER_CONTRACT as `0x${string}`;
const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;

// define minting contract config
const sourceMinterContract = {
    address: SOURCE_MINTER_CONTRACT,
    abi: sourceMinterABI,
    chainId: bsc.id,
    config
};

// define nft contract config
const nftContract = {
    address: NFT_CONTRACT,
    abi: nftABI,
    chainId: base.id,
    config
};

type Props = {};

export default function MintInfo({ }: Props) {

    // let [paused, setPaused] = useState<boolean>(true);
    let [soldOut, setSoldOut] = useState<boolean>(true);

    // check if paused
    const { data: paused } = useReadContract({
        ...sourceMinterContract,
        functionName: "isPaused",
        query: {
            refetchOnMount: true,
        },
    });

    // check if paused
    useEffect(() => {

        async function isSoldOut(): Promise<boolean | undefined> {
            const totalSupply = await readContract(config, {
                ...nftContract,
                functionName: "totalSupply",
            });

            const maxSupply = await readContract(config, {
                ...nftContract,
                functionName: "getMaxSupply",
            });

            return (maxSupply == totalSupply);
        }

        isSoldOut().then((allSold) => {
            if (allSold !== undefined) {
                setSoldOut(allSold)
            }
        })

    }, [])

    return (
        <div className="h-fit mx-auto w-full max-w-md mt-8 md:mt-auto rounded-md border-secondary border-2 text-primary p-6 md:max-w-lg xl:max-w-96 ">
            {paused && !soldOut && <Image
                className='h-auto mx-auto mb-4 w-full'
                src='/mintingSoon.png'
                width={1024}
                height={1024}
                alt="Minting Soon"
                priority
            >
            </Image>}
            {!paused && !soldOut && <Image
                className='h-auto mx-auto mb-4 w-full'
                src='/mintingLive.png'
                width={1024}
                height={1024}
                alt="Minting Live"
                priority
            >
            </Image>}
            {soldOut && <Image
                className='h-auto mx-auto mb-4 w-full'
                src='/soldOut.png'
                width={1024}
                height={1024}
                alt="Minting Live"
                priority
            >
            </Image>}
            <MintButton paused={paused || paused == undefined}></MintButton>
        </div>
    );
}