"use client";

import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
    const { language, setLanguage, translations } = useTranslation();

    return (
        <Link href="/" className="horizontal-flex cursor-pointer hover:opacity-80 transition-opacity">
            <Image
                src="/favicon.ico"
                alt={translations.altText?.logo || "AGA Logo"}
                width={30}
                height={30}
                priority
            />

            <h1 className="text-[25px] font-bold">{translations.title || "AGA"}</h1>
        </Link>
    );
}
