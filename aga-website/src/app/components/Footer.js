"use client";

import useTranslation from "@/hooks/useTranslation";
import Media from "@/app/components/Media";
import Logo from "@/app/components/Logo";
import Link from "next/link";

export default function Footer() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div className="center relative bottom-0">
            <div className="md:px-4 lg:px-16 center">
                <div>
                    <Media />
                </div>
            </div>

            <div className="flex hide space-x-10 font-bold"> 
                <Link href="/" className="hover:text-[#36bee0] transition-colors">
                    {translations.button?.home || "Home"}
                </Link>
                <Link href="/about" className="hover:text-[#36bee0] transition-colors">
                    {translations.button?.about || "About"}
                </Link>
                <Link href="/tools" className="hover:text-[#36bee0] transition-colors">
                    {translations.button?.tools || "Tools"}
                </Link>
                <Link href="/help" className="hover:text-[#36bee0] transition-colors">
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