import useTranslation from "@/hooks/useTranslation";

export default function TaskSetter() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>TaskSetter</h1>
        </div>
    );
}