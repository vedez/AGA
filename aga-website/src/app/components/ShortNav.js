import useTranslation from "@/hooks/useTranslation";
import ProfileIcon from "@/app/components/ProfileIcon"
import { Devonshire } from "next/font/google";
import LanguageSwitcher from "./LanguageSwitcher";
import RegisterLogin from "./RegisterLogin";

export default function Navbar() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <div>
                <button>{translations.button?.home || "Home"}</button>
                <button>{translations.button?.about || "About"}</button>
            </div>

            <div>
                <div><ProfileIcon /></div>
                <div><RegisterLogin /></div>

                <LanguageSwitcher />
            </div>
            
        </div>
    );
}