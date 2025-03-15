import useTranslation from "@/hooks/useTranslation";

export default function FocusMode() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>FocusMode</h1>
        </div>
    );
}