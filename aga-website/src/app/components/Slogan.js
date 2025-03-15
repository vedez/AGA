import useTranslation from "@/hooks/useTranslation";

export default function Slogan() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <h2>ONE <span id="changing-word">UNIT</span> AT A TIME</h2>
    );
}