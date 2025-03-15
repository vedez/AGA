import useTranslation from "@/hooks/useTranslation";

export default function Calendar() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>Calendar</h1>
        </div>
    );
}