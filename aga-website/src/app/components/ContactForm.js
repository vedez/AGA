import useTranslation from "@/hooks/useTranslation";

export default function ContactForm() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div>
            <h1>{translations.components?.contactUs || "Contact Us"}</h1>
            <form>
                
            </form>
        </div>
    );
}