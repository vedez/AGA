import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";

export default function DesignLogo() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <div>
                <Image
                    src="/favicon.ico"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />

                <h1>{translations.title || "AGA"}</h1>
            </div>
            <h2>{translations.abbreviation || "Advance Guidance Assistance"}</h2>
        </div>
    );
}

