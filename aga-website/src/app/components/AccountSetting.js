import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";

export default function AccountSetting() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>Settings Form</h1>
        </div>
    );
}