import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";

export default function ProfilePhoto() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <Image
                src="/favicon.ico"
                alt="Next.js logo"
                width={180}
                height={38}
                priority
            />
            <h1>{translations.profile?.changePhoto || "Change Photo"}</h1>
        </div>
    );
}