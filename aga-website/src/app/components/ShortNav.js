"use client";

import useTranslation from "@/hooks/useTranslation";
import ProfileIcon from "@/app/components/ProfileIcon"
import LanguageSwitcher from "./LanguageSwitcher";
import Link from "next/link";


export default function Navbar() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div className="center gap-x-3">
            <div className="space-x-5 font-semibold hide">
                <Link href="/" className="hover:text-[#36bee0] transition-colors">
                    {translations.button?.home || "Home"}
                </Link>
                <Link href="/about" className="hover:text-[#36bee0] transition-colors">
                    {translations.button?.about || "About"}
                </Link>
            </div>

            <div className="horizontal-flex gap-x-3">
                <div><ProfileIcon /></div>

                <LanguageSwitcher />
            </div>
            
        </div>
    );
}