import { config } from "@/lib/config";
import { NextResponse } from "next/server";
import { getAccount } from "wagmi/actions";

const NFT_CONTRACT = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}`;

export async function GET() {
  const options = { method: "GET", headers: { accept: "application/json" } };
  const account = getAccount(config);
  fetch(
    `https://base-mainnet.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/getNFTsForOwner?owner=${account}&contractAddresses[]=${NFT_CONTRACT}&withMetadata=true&pageSize=100`,
    options
  )
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));

  //   const burned = Number(formatEther(data));
  //   const circulating_supply = 1000000000 - burned;
  const tokenIds = [0, 1, 2, 3];
  return NextResponse.json(tokenIds, { status: 200 });
}
