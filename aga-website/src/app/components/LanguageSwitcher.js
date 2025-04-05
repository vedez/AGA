"use client";

import { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";
import { MdLanguage } from "react-icons/md";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation();
    const [open, setOpen] = useState(false);

    const languages = ["en", "es", "fr", "de", "zh", "kr", "tl"];

    return (
        <div className="relative inline-block">
            {/* Globe Icon Toggle */}
            <button
                onClick={() => setOpen(!open)}
                className="text-xl hover:opacity-80 transition center"
                aria-label="Toggle language selector"
            >
                <MdLanguage />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute mt-2 bg-white border rounded shadow-md z-50 flex flex-col items-start p-2">
                    {languages.map((code) => (
                        <button
                            key={code}
                            onClick={() => {
                                setLanguage(code);
                                setOpen(false);
                            }}
                            className="p-1 hover:scale-105 transition-transform"
                        >
                            <Image
                                src={`/assets/flags/${code}.jpg`}
                                alt={`${code} flag`}
                                width={24}
                                height={16}
                                className={`rounded-sm border ${
                                    language === code ? "border-blue-500" : "border-transparent"
                                }`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
