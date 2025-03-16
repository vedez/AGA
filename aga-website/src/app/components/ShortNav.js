import useTranslation from "@/hooks/useTranslation";
import ProfileIcon from "@/app/components/ProfileIcon"
import LanguageSwitcher from "./LanguageSwitcher";


export default function Navbar() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div className="center gap-x-3">
            <div className="space-x-5 font-semibold">
                <button>{translations.button?.home || "Home"}</button>
                <button>{translations.button?.about || "About"}</button>
            </div>

            <div className="horizontal-flex gap-x-3">
                <div><ProfileIcon /></div>

                <LanguageSwitcher />
            </div>
            
        </div>
    );
}