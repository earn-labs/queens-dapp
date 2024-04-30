import Image from "next/image";
import MintButton from "./mintButton";

type Props = {};

export default function MintInfo({ }: Props) {
    return (
        <div className="h-fit mx-auto w-fit rounded-md border-secondary border-2 my-2 text-primary p-6 max-w-md">

            <Image
                className='h-auto mx-auto mb-4 border-2 w-full lg:max-w-56 xl:max-w-64'
                src='/flamelingQueens.jpg'
                width={1024}
                height={1024}
                alt="EARN logo"
                priority
            >
            </Image>
            <MintButton></MintButton>

        </div>
    );
}