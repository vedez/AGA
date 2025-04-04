import useTranslation from "@/hooks/useTranslation";

export default function ToolInfo() {
    const { translations } = useTranslation();

    return(
        <div>
            <h1 id="#tool-information">{translations.components?.toolInfo || "Tool Information"}</h1>
        </div>
    );
}