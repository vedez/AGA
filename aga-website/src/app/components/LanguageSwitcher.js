"use client";

import useTranslation from "@/hooks/useTranslation";

export default function LanguageSwitcher() {
    const { language, setLanguage, translations } = useTranslation();

    return (
        <div>
            <select className="language-select">
                <option className="languageOption" value="en">
                    {translations.languageOption?.english || "EN"}
                </option>
                <option className="languageOption" value="es">
                    {translations.languageOption?.spanish || "ES"}
                </option>
            </select>

        </div>
    );
}
