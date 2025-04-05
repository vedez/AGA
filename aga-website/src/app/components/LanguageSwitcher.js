"use client";
 
import useTranslation from "@/hooks/useTranslation";
 
export default function LanguageSwitcher() {
    const { language, setLanguage, translations } = useTranslation();
 
    return (
        <div>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border rounded text-xs"
            >
                <option className="languageOption p-1" value="en">EN</option>
                <option className="languageOption p-1" value="es">ES</option>
                <option className="languageOption p-1" value="fr">FR</option>
                <option className="languageOption p-1" value="de">DE</option> 
                <option className="languageOption p-1" value="zh">ZH</option>
                <option className="languageOption p-1" value="kr">KR</option> 
                <option className="languageOption p-1" value="tl">TL</option>   
            </select>
        </div>
    );
}