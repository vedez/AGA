import useTranslation from "@/hooks/useTranslation";
import Media from "@/app/components/Media";
import Logo from "@/app/components/Logo"

export default function Footer() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div className="center">
            <div className="px-16 center">
                <div>
                    <Media />
                </div>
            </div>

            <div className="center"> 
                <button className="px-2">{translations.button?.home || "Home"}</button>
                <button className="px-2">{translations.button?.about || "About"}</button>
                <button className="px-2">{translations.button?.tools || "Tools"}</button>
                <button className="px-2">{translations.button?.help || "Help"}</button>
            </div>

            <div className="px-16 m-0">
                <h1 className="text-center">zedev (c) 2025</h1>
                <div className="place-items-center">
                    <Logo />
                </div>
            </div>
        
        </div>

    );
}