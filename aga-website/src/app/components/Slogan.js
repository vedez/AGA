"use client";

import useTranslation from "@/hooks/useTranslation";
import useUnitWordsRotator from "@/hooks/useUnitWordsRotator";

export default function Slogan() {
    const { language, translations } = useTranslation();
    const currentWord = useUnitWordsRotator(language);

    return (
        // "One <WORD> at a time. Where <WORD> changes."
        <div className="text-[#3d9cb4] text-5xl sm:text-6xl font-bold">
            <h2>
                {translations.slogan?.one || "ONE"}
                <span
                    id="changing-word"
                    className="text-[#67d360] transition-opacity duration-500 ease-in-out"
                >
                    {" "}{currentWord}
                </span>
            </h2>
            <h2>
                {translations.slogan?.at_a_time || "AT A TIME"}
            </h2>
        </div>
    );
}
