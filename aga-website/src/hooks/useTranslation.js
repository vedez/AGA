import { useState, useEffect } from "react";
import { loadLanguage } from "@/app/utils/loadLanguage";

export default function useTranslation(defaultLanguage = "en") {
    // Initialize language from localStorage or use default
    const [language, setLanguage] = useState(() => {
        // Check if we're in the browser environment
        if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('language');
            return savedLanguage || defaultLanguage;
        }
        return defaultLanguage;
    });
    
    const [translations, setTranslations] = useState({});

    // Update localStorage when language changes and force page refresh
    const handleSetLanguage = (newLanguage) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', newLanguage);
            window.location.reload();
        }
        setLanguage(newLanguage);
    };

    useEffect(() => {
        async function fetchLanguage() {
            const loadedTranslations = await loadLanguage(language);
            setTranslations(loadedTranslations);
        }

        fetchLanguage();
    }, [language]);

    return { language, setLanguage: handleSetLanguage, translations };
}
