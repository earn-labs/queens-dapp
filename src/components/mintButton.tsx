import { sourceMinterABI } from '@/assets/sourceMinterABI';
import { tokenABI } from '@/assets/tokenABI';
import { config } from '@/lib/config';
import { Dialog, Transition } from '@headlessui/react'
import { MoonLoader } from 'react-spinners';
import { Fragment, useEffect, useState } from 'react'
import { parseEther } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { bsc } from 'wagmi/chains';
import Image from 'next/image';
import { ConnectKitButton } from 'connectkit';

const SOURCE_MINTER_CONTRACT = process.env.NEXT_PUBLIC_SOURCE_MINTER_CONTRACT as `0x${string}`;
const DESTINATION_MINTER_CONTRACT = process.env.NEXT_PUBLIC_DESTINATION_MINTER_CONTRACT as `0x${string}`;
const TOKEN_CONTRACT = process.env.NEXT_PUBLIC_TOKEN_CONTRACT as `0x${string}`;

// define token contract config
const tokenContract = {
    address: TOKEN_CONTRACT,
    abi: tokenABI,
    chainId: bsc.id,
    config
};

// define token contract config
const sourceMinterContract = {
    address: SOURCE_MINTER_CONTRACT,
    abi: sourceMinterABI,
    chainId: bsc.id,
    config
};

async function hasTokensApproved(account: `0x${string}` | undefined): Promise<[boolean, bigint]> {

    // read allowance
    const allowance = await readContract(config, {
        ...tokenContract,
        functionName: "allowance",
        args: [account as `0x${string}`, SOURCE_MINTER_CONTRACT]
    });

    // read token fee
    const tokenFee = await readContract(config, {
        ...sourceMinterContract,
        functionName: "getTokenFee",
    });

    if (allowance < tokenFee) {
        return [false, tokenFee];
    }
    else {
        return [true, tokenFee];
    }
}

export default function MintButton() {
    let [isOpen, setIsOpen] = useState(false);
    let [isApproving, setIsApproving] = useState(false);
    let [isMinting, setIsMinting] = useState(false);
    let [quantity, setQuantity] = useState<number>(1);
    const { address, isConnected, isDisconnected } = useAccount();

    const { data: mintHash,
        isPending: mintPending,
        isError: mintError,
        writeContract: callMint } = useWriteContract();

    const { data: approveHash,
        isPending: approvePending,
        isError: approveError,
        writeContract: callApprove } = useWriteContract();

    // approve
    async function approve(tokenFee: bigint) {
        callApprove({
            ...tokenContract,
            functionName: "approve",
            args: [SOURCE_MINTER_CONTRACT, tokenFee],
            account: address,
        });
    }

    // mint
    async function mint() {
        // read nft ETH fee
        const ethFee = await readContract(config, {
            ...sourceMinterContract,
            functionName: "getEthFee",
        });
        callMint({
            ...sourceMinterContract,
            functionName: "mint",
            args: [DESTINATION_MINTER_CONTRACT, BigInt(quantity)],
            value: ethFee + parseEther('0.002'),
            account: address,
        });
    }

    async function onSubmit() {
        // setIsOpen(true);
        const [approved, tokenFee] = await hasTokensApproved(address);
        if (approved) {
            setIsMinting(true);
            mint();
        }
        else {
            setIsApproving(true);
            approve(tokenFee);
        }
    }

    const { isLoading: isConfirmingMint, isSuccess: isConfirmedMint } =
        useWaitForTransactionReceipt({
            confirmations: 3,
            hash: mintHash
        })

    const { isLoading: isConfirmingApprove, isSuccess: isConfirmedApprove } =
        useWaitForTransactionReceipt({
            confirmations: 3,
            hash: approveHash,
        })

    useEffect(() => {
        if (isConfirmedApprove) {
            setIsApproving(false);
            setIsMinting(true);
            mint();
        }
    }, [isConfirmedApprove]);

    useEffect(() => {
        if (isConfirmedMint) {
            setTimeout(() => {
                setIsMinting(false);
            }, 2000);
        }
    }, [isConfirmedMint]);

    useEffect(() => {
        if (isApproving || isMinting) {
            setIsOpen(true);
        }
        else {
            setIsOpen(false);
        }
    }, [isApproving, isMinting])

    useEffect(() => {
        if (approveError) {
            setIsApproving(false);
        }
    }, [approveError])

    useEffect(() => {
        if (mintError) {
            setIsMinting(false);
        }
    }, [mintError])

    function closeModal() {
        setIsApproving(false);
        setIsMinting(false);
    }

    return (
        <>
            <div className="flex items-center justify-center">
                <form>
                    <input className="mx-auto ml-3 rounded bg-inputBackground p-1 text-center hidden"
                        value={quantity}
                        type="number"
                        name="numNFTs"
                        placeholder="1"
                        onChange={(e) => {
                            setQuantity(Number(e.target.value));
                        }}
                        required />
                    {!isConnected && <ConnectKitButton />}
                    {isConnected && <button
                        type="button"
                        disabled={mintPending || approvePending}
                        onClick={onSubmit}
                        className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-black hover:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                    >
                        MINT
                    </button>}
                </form>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="flex items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="aspect-square flex flex-col justify-between w-screen max-w-xs transform overflow-hidden rounded-2xl text-white bg-white/20 backdrop-blur p-6 xxs:p-10 text-center align-middle shadow-xl transition-all">
                                    <div className='h-full w-full flex flex-col justify-between'>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium leading-6 text-primary "
                                        >
                                            {isMinting ? <div>Minting NFT</div> : <div>Approving Tokens</div>}
                                        </Dialog.Title>
                                        <div>
                                            <div className="mt-2 text-xs sm:text-sm text-white">
                                                {isApproving && approvePending && <p>Approve 1 Million 0X52 tokens in your wallet to mint 1 NFT.</p>}
                                                {isApproving && isConfirmingApprove && <p>Approving 1 Million 0X52...</p>}
                                                {isMinting && mintPending && <div><p>Confirm transaction in your wallet.</p><p>A 0.2 BNB minting fee and transaction fees will be applied.</p></div>}
                                                {isMinting && isConfirmingMint && <p>Minting your NFT...</p>}
                                                {isMinting && isConfirmedMint && <p >Mint Successful!</p>}

                                            </div>
                                            <div className='my-4 flex justify-center h-16'>
                                                {(isConfirmingApprove || isConfirmingMint) ? <MoonLoader className='my-auto' color="#FFFFFF" speedMultiplier={0.7} /> :
                                                    <Image
                                                        className='h-full w-auto my-auto'
                                                        src='/logo_transparent.png'
                                                        width={50}
                                                        height={50}
                                                        alt="EARN logo"
                                                        priority
                                                    >
                                                    </Image>}
                                            </div>
                                        </div>
                                    </div>

                                    <div >
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md bg-white/20 px-4 py-2 text-sm font-medium text-black hover:bg-white/40"
                                            onClick={closeModal}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition >
        </>
    )
}
