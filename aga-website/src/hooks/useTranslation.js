import { useState, useEffect } from "react";
import { loadLanguage } from "@/app/utils/loadLanguage";

export default function useTranslation(defaultLanguage = "en") {
    const [language, setLanguage] = useState(defaultLanguage);
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        async function fetchLanguage() {
            const loadedTranslations = await loadLanguage(language);
            setTranslations(loadedTranslations);
          
        }

        fetchLanguage();
    }, [language]);

    return { language, setLanguage, translations };
}
