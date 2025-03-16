import useTranslation from "@/hooks/useTranslation";

export default function Adverts() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>{translations.components?.adverts || "Adverts"}</h1>
        </div>
    );
}