"use client";

import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    const { translations } = useTranslation();

    return (
        <Link href="/" className="horizontal-flex cursor-pointer hover:opacity-80 transition-opacity w-5 h-5 sm:w-[30px] sm:h-[30px]">
            <Image
                src="/favicon.ico"
                alt={translations.altText?.logo || "AGA Logo"}
                width={30}
                height={30}
                priority
            />

            <h1 className="text-[15px] sm:text-[25px] font-bold">{translations.title || "AGA"}</h1>
        </Link>
    );
}

