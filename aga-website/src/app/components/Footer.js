"use client";

import useTranslation from "@/hooks/useTranslation";
import Media from "@/app/components/Media";
import Logo from "@/app/components/Logo";
import Link from "next/link";

export default function Footer() {
    const { translations } = useTranslation();

    return(
        <div className="center relative bottom-0">
            <div className="md:px-4 lg:px-16 center">
                <div>
                    <Media size={25} />
                </div>
            </div>

            <div className="flex hide space-x-10 font-bold"> 
                <Link href="/main" className="text-link">
                    {translations.button?.home || "Home"}
                </Link>
                <Link href="/about" className="text-link">
                    {translations.button?.about || "About"}
                </Link>
                <Link href="/help#tool-information" className="text-link">
                    {translations.button?.tools || "Tools"}
                </Link>
                <Link href="/help" className="text-link">
                    {translations.button?.help || "Help"}
                </Link>
            </div>

            <div className="md:px-4 lg:px-16">
                <div className="place-items-center">
                    <Logo />
                </div>
                <h1 className="text-center text-sm">zedev (c) 2025</h1>
            </div>
        </div>
    );
}