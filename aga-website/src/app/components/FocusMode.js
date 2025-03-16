import useTranslation from "@/hooks/useTranslation";

export default function FocusMode() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>{translations.components?.focusMode || "Focus Mode"}</h1>
        </div>
    );
}