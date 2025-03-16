import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";

export default function AccountSetting() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>{translations.profile?.account || "Account Settings"}</h1>
            <div>
                <h2>{translations.profile?.preferences || "Preferences"}</h2>
                <h2>{translations.profile?.security || "Security"}</h2>
                <h2>{translations.profile?.notifications || "Notifications"}</h2>
            </div>
        </div>
    );
}