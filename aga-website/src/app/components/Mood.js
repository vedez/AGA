import useTranslation from "@/hooks/useTranslation";

export default function Mood() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>{translations.components?.mood || "Mood"}</h1>
        </div>
    );
}