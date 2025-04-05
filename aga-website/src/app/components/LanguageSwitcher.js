"use client";

import { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import { MdLanguage } from "react-icons/md";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation();
    const [open, setOpen] = useState(false);

    const languages = ["en", "es", "fr", "de", "zh", "kr", "tl"];

    // Languages with their display names for better accessibility
    const languageNames = {
        en: "English",
        es: "Español",
        fr: "Français",
        de: "Deutsch",
        zh: "中文",
        kr: "한국어",
        tl: "Tagalog"
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                className="text-xl hover:opacity-80 transition center"
                aria-label="Toggle language selector"
            >
                <MdLanguage />
            </button>

            {open && (
                <div className="absolute mt-2 bg-white border rounded shadow-md z-50 flex flex-col items-start p-2 right-0">
                    {languages.map((code) => (
                        <button
                            key={code}
                            onClick={() => {
                                setLanguage(code);
                                setOpen(false);
                            }}
                            className="p-1 hover:bg-gray-100 transition-colors w-full flex items-center gap-2"
                            title={languageNames[code] || code}
                        >
                            <div className="w-6 h-4 relative">
                                <Image
                                    src={`/assets/flags/${code}.jpg`}
                                    alt={`${languageNames[code] || code} flag`}
                                    fill
                                    sizes="24px"
                                    priority
                                    className={`object-cover rounded-sm ${
                                        language === code ? "border-2 border-blue-500" : ""
                                    }`}
                                />
                            </div>
                            <span className="text-xs">{languageNames[code] || code}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
