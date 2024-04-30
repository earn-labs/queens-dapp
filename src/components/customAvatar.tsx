import { Types } from "connectkit";
import Image from "next/image";

const CustomAvatar = ({ address, ensImage, ensName, size, radius }: Types.CustomAvatarProps) => {
    return (
        <Image
            src="/logo.png"
            alt="EARN logo"
            className={`h-[${size}] w-[${size}]`}
            width={40}
            height={40}
        />
    );
};

export default CustomAvatar;