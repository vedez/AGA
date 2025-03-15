import useTranslation from "@/hooks/useTranslation";

export default function Weather() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>Weather</h1>
        </div>
    );
}