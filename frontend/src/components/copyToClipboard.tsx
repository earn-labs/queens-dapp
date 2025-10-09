"use client";
import { useEffect, useState } from "react";
import { ClipboardDocumentIcon, CheckIcon } from "@heroicons/react/24/solid";

/*//////////////////////////////////////////////////////////////
                   COMPONENT COPYTOCLIPBOARD
//////////////////////////////////////////////////////////////*/
export default function CopyToClipboard(props: { text: string; copyText: string; textColor: string; textSize: string; iconSize: string }) {
    const [copied, setCopied] = useState<boolean>(false);

    // timeout
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCopied(false);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [copied]);

    // copy link
    const copylink = async (e: any) => {
        try {
            navigator.clipboard.writeText(props.copyText);
            setCopied(true);
            console.log("copied: " + props.copyText);
        } catch (e) {
            console.log(e);
        }
    };

    // return component
    return (
        <div className="flex flex-row hover:cursor-pointer opacity-60 hover:opacity-100 transition-all duration-100 w-36 xs:w-64 md:w-80 lg:w-44 h-10 my-auto align-middle justify-start">
            <div onClick={copylink} className={`${props.textSize} ${props.textColor} text-ellipsis overflow-hidden my-auto`}>{props.text}</div>
            <div onClick={copylink} className="flex justify-center align-middle  my-auto">
                <div className={`${props.textColor} ${props.iconSize} ml-2 mt-0 h-full align-middle w-4 `}>
                    {copied ? <CheckIcon /> : <ClipboardDocumentIcon />}
                </div>

            </div>
        </div>
    );
}