"use client";

import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";

export default function Logo() {
    const { language, setLanguage, translations } = useTranslation();

    return (
        <div className="horizontal-flex">
            <Image
                src="/favicon.ico"
                alt={translations.altText?.logo || "AGA Logo"}
                width={40}
                height={40}
                priority
            />

            <h1 className="text-[30px] font-bold">{translations.title || "AGA"}</h1>
        </div>
    );
}
