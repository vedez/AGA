import useTranslation from "@/hooks/useTranslation";

export default function Navbar() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <button>{translations.button?.home || "Home"}</button>
            <button>{translations.button?.about || "About"}</button>
            <button>{translations.button?.tools || "Tools"}</button>
            <button>{translations.button?.help || "Help"}</button>
        </div>
    );
}