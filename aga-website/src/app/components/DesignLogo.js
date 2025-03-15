import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";

export default function DesignLogo() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center">
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

