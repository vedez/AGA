import useTranslation from "@/hooks/useTranslation";
import Media from "@/app/components/Media";
import Logo from "@/app/components/Logo"

export default function Footer() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <div> 
                <button>{translations.button?.home || "Home"}</button>
                <button>{translations.button?.about || "About"}</button>
                <button>{translations.button?.tools || "Tools"}</button>
                <button>{translations.button?.help || "Help"}</button>
            </div>

            <div>
                <div>
                    <Media />
                </div>
                <div>
                    <Logo />
                </div>
            </div>

            <h1>zedev 2025</h1>
        </div>

    );
}