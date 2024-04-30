
"use client";
import AccountInfo from '@/components/accountInfo';
import CollectionInfo from '@/components/collectionInfo';
import Footer from '@/components/footer';
import MintButton from '@/components/mintButton';
import MintInfo from '@/components/mintInfo';
import Navbar from '@/components/navbar';
import { ConnectKitButton } from 'connectkit';
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex lg:h-screen min-h-screen flex-col bg-bgColor justify-stretch">
      <div className="mx-auto w-full flex flex-col xl:w-5/6 h-full mt-8 px-8 sm:px-12 items-stretch">
        <Navbar></Navbar>

        <div>
          <Image
            className='h-auto mx-auto mt-4 lg:w-[45%]'
            src='/title.png'
            width={2553}
            height={960}
            alt="collection title"
            priority
          >
          </Image>
          <div className='text-secondary mx-auto text-center my-4 max-w-4xl'>{process.env.NEXT_PUBLIC_PROJECT_DESCRIPTION}</div>
        </div>
        <div>

        </div>
        <div className="w-full gap-4 md:gap-12 flex flex-row flex-wrap-reverse lg:flex-nowrap justify-between h-full mb-8">
          <div className="h-full flex flex-col w-full justify-end">
            <CollectionInfo></CollectionInfo>
          </div>
          <div className="h-full flex flex-col w-full justify-end">

            <AccountInfo></AccountInfo>
          </div>
          <div className="h-full flex flex-col w-full justify-end">
            <MintInfo></MintInfo>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </main>
  );
}
