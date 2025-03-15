import useTranslation from "@/hooks/useTranslation";

export default function Media() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div> 
            <button>{translations.button?.instagram || "[ O ]"}</button>
            <button>{translations.button?.twitter || "[ X ]"}</button>
            <button>{translations.button?.github || "(o w o)"}</button>
            <button>{translations.button?.linkedin || "[ LN ]"}</button>
        </div>
    );
}