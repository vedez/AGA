import useTranslation from "@/hooks/useTranslation";

export default function ToolInfo() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>{translations.components?.toolInfo || "Tool Information"}</h1>
        </div>
    );
}