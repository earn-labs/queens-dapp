import Link from "next/link";


/*//////////////////////////////////////////////////////////////
                          COMPONENT FOOTER
//////////////////////////////////////////////////////////////*/

export default function Footer() {
    return (
        <footer className="text-secondary text-center my-8 text-opacity-60 bottom-0 z-50 px-8 text-sm">
            <div>
                {"Created by "}
                <Link className="font-bold" href="https://twitter.com/laylascreations">@laylascreations</Link>
                {" & "}
                <Link className="font-bold" href="https://twitter.com/0xTrashPirate">@0xTrashPirate</Link>
            </div>
        </footer>);
}