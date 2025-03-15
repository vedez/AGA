import useTranslation from "@/hooks/useTranslation";

export default function ToolInfo() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>Tool Information</h1>
        </div>
    );
}