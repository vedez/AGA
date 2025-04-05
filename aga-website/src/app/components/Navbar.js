"use client";

import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

export default function Navbar() {
    const { translations } = useTranslation();

    return(
        <div className="flex space-x-6">
            {currentUser ? (
                <Link href="/main" className="text-link">
                    {translations.button?.home || "Home"}
                </Link>
            ) : (
                <Link href="/account" className="text-link">
                    {translations.button?.home || "Home"}
                </Link>
            )}
            <Link href="/about" className="text-link">
                {translations.button?.about || "About"}
            </Link>
            <Link href="/tools" className="text-link">
                {translations.button?.tools || "Tools"}
            </Link>
            <Link href="/help" className="text-link">
                {translations.button?.help || "Help"}
            </Link>
        </div>
    );
}