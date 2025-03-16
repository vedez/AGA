"use client";

import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function Navbar() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div className="flex space-x-6">
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
    );
}