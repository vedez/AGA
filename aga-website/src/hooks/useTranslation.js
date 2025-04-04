import { useState, useEffect } from "react";
import { loadLanguage } from "@/app/utils/loadLanguage";

export default function useTranslation(defaultLanguage = "en") {
    // initialise language from localStorage or fall back to default
    const [language, setLanguage] = useState(() => {
        // check if we're in a browser environment
        if (typeof window !== 'undefined') {
            const savedLanguage = localStorage.getItem('language');
            return savedLanguage || defaultLanguage;
        }
        return defaultLanguage;
    });
    
    // hold the current set of translations
    const [translations, setTranslations] = useState({});

    // update language => save to localStorage and refresh the page
    const handleSetLanguage = (newLanguage) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('language', newLanguage); // store selected language
            window.location.reload(); // force a full refresh to apply changes
        }
        setLanguage(newLanguage); // also update state 
    };

    // load translation file when the language changes
    useEffect(() => {
        async function fetchLanguage() {
            const loadedTranslations = await loadLanguage(language); // fetch translations dynamically
            setTranslations(loadedTranslations); // update state with new content
        }

        fetchLanguage(); // run on first mount and when `language` changes
    }, [language]);

    // return values to consuming components
    return { language, setLanguage: handleSetLanguage, translations };
}
