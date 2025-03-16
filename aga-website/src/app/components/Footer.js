import useTranslation from "@/hooks/useTranslation";
import Media from "@/app/components/Media";
import Logo from "@/app/components/Logo";

export default function Footer() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div className="center">
            <div className="md:px-4 lg:px-16 center">
                <div>
                    <Media />
                </div>
            </div>

            <div className="flex hide space-x-10 font-bold"> 
                <button>{translations.button?.home || "Home"}</button>
                <button>{translations.button?.about || "About"}</button>
                <button>{translations.button?.tools || "Tools"}</button>
                <button>{translations.button?.help || "Help"}</button>
            </div>

            <div className="md:px-4 lg:px-16 m-0">
                <div className="place-items-center">
                    <Logo />
                </div>
                <h1 className="text-center text-sm">zedev (c) 2025</h1>
            </div>
        
        </div>

    );
}