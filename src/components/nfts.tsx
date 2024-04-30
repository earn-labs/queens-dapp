import Link from "next/link";
import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { useAccount, useReadContract } from "wagmi";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, MusicalNoteIcon, VideoCameraIcon, LinkIcon } from "@heroicons/react/24/solid";
import { nftABI } from "@/assets/nftABI";
import { base } from "viem/chains";
import { config } from "@/lib/config";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;

const alchemyConfig = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.BASE_MAINNET,
};
const alchemy = new Alchemy(alchemyConfig);



type NFTMeta = {
    id: number;
    image: string;
    audio: string;
    video: string;
    youtube: string;
    title: string;
};

function getUrl(ipfsLink: string | undefined): string {
    if (ipfsLink === undefined) {
        return "";
    }
    const suburl = ipfsLink.replace("://", "/");
    return `https://dweb.link/${suburl}`;
}

export default function Nfts() {

    const [nftsOwned, setNftsOwned] = useState<NFTMeta[] | null>(null);
    const [currentIdx, setCurrentIdx] = useState<number>(0);

    // get account address
    const { address, isConnected, isReconnecting } = useAccount({});

    // define token contract config
    const nftContract = {
        address: NFT_CONTRACT,
        abi: nftABI,
        chainId: base.id,
        config
    };

    // read nft balance
    const {
        data: nftBalance,
        isLoading: nftLoading,
        isSuccess: nftSuccess
    } = useReadContract({
        ...nftContract,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
        query: {
            enabled: isConnected && address != null,
        },
    });

    useEffect(() => {
        async function getNFTs() {
            let imageArray: NFTMeta[] = [];
            if (isConnected) {
                const nfts = await alchemy.nft.getNftsForOwner(address as `0x${string}`);
                let nftList = nfts['ownedNfts'];
                for (let index = nftList.length - 1; index >= 0; index--) {

                    const animation_url = getUrl(nftList[index].raw.metadata.animation_url);
                    const external_url = getUrl(nftList[index].raw.metadata.external_url);
                    const youtube_url = nftList[index].raw.metadata.youtube_url ?? "";

                    let nft: NFTMeta = {
                        id: Number(nftList[index].tokenId),
                        image: nftList[index].image.cachedUrl as string,
                        audio: external_url,
                        video: animation_url,
                        youtube: youtube_url,
                        title: nftList[index].name as string
                    };
                    imageArray.push(nft);
                }
            }
            return imageArray;
        }

        if (nftBalance !== undefined && nftBalance > 0) {
            getNFTs().then((nfts) => { setNftsOwned(nfts) });
        }
        else {
            setNftsOwned(null);
        }

    }, [nftBalance]);


    function forward() {
        if (nftsOwned?.length !== undefined && currentIdx < nftsOwned?.length) {
            setCurrentIdx(currentIdx + 1);
        }
        else {
            setCurrentIdx(0);
        }

    }

    function backward() {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
        else if (nftsOwned?.length !== undefined) {
            setCurrentIdx(nftsOwned?.length - 1);
        }

    }

    return (
        <>
            {nftsOwned == null || nftsOwned.length == 0 ? "no data" :
                <div className="text-white mb-4 mt-4 md:mt-auto flex flex-row justify-center gap-5">

                    <button className="opacity-70 hover:opacity-100 ease-in-out duration-500" onClick={backward}>
                        <ChevronLeftIcon className="size-6 text-primary" />
                    </button>


                    <div className="h-fit w-fit rounded-lg overflow-hidden relative">
                        <Link href={`https://opensea.io/assets/base/${NFT_CONTRACT}/${nftsOwned[currentIdx].id}`} >
                            <Image
                                className='h-auto mx-auto mb-4 w-full max-w-48 object-cover overlfow-hidden'
                                src={nftsOwned[currentIdx].image}
                                width={1024}
                                height={1024}
                                alt="Flameling Queens NFT"
                                priority
                            >

                            </Image>
                            <div className="absolute top-2 left-2 bg-primary text-white rounded-full text-[12px] w-8 h-8 flex justify-center align-middle">
                                <div className="text-center m-auto">
                                    {`#${nftsOwned[currentIdx].id}`}
                                </div>
                            </div>
                            {nftsOwned[currentIdx].audio.length > 0 && <div className="absolute top-2 right-2 bg-primary text-white rounded-full text-[12px] w-8 h-8 flex justify-center align-middle">
                                <div className="text-center m-auto">
                                    <Link href={nftsOwned[currentIdx].audio}>
                                        <MusicalNoteIcon className="size-4" />
                                    </Link>
                                </div>
                            </div>}
                            {nftsOwned[currentIdx].video.length > 0 && <div className="absolute bottom-10 right-2 bg-primary text-white rounded-full text-[12px] w-8 h-8 flex justify-center align-middle">
                                <div className="text-center m-auto">
                                    <Link href={nftsOwned[currentIdx].video}>
                                        <VideoCameraIcon className="size-4" />
                                    </Link>
                                </div>
                            </div>}
                            {nftsOwned[currentIdx].youtube.length > 0 && <div className="absolute bottom-10 left-2 bg-primary text-white rounded-full text-[12px] w-8 h-8 flex justify-center align-middle">
                                <div className="text-center m-auto">
                                    <Link href={nftsOwned[currentIdx].youtube}>
                                        <LinkIcon className="size-4" />
                                    </Link>
                                </div>
                            </div>}
                            <div className="absolute bottom-0 left-1/2 text-center -translate-x-1/2 w-full bg-primary p-1">{`${nftsOwned[currentIdx].title}`}</div>

                        </Link>
                    </div>


                    <button className="opacity-70 hover:opacity-100 ease-in-out duration-500" onClick={forward}>
                        <ChevronRightIcon className="size-6 text-primary" />
                    </button>
                </div >}
        </>
    );
}