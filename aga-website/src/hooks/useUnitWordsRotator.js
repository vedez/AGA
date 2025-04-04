import { useEffect, useState } from "react";

export default function useUnitWordsRotator(language = "en") {
    const [words, setWords] = useState([]);

    const defaultWords = {
        en: "UNIT",
        es: "UNIDAD",
        fr: "UNITÉ",
        de: "EINHEIT",
    };
    const [currentWord, setCurrentWord] = useState(defaultWords[language] || "UNIT");

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const fileName = `${language}-unit.json`;
                const res = await fetch(`/json/${fileName}`);

                if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

                const data = await res.json();
                setWords(data.unit || []);
            } catch (error) {
                console.error("Unable to retrieve json file for unit words", error);
                setWords(["UNIT"]); // fallback
            }
        };
        fetchWords();
    }, [language]);

    useEffect(() => {
        if (words.length === 0) return;

        let index = 0;
        let counter = 0;

        const interval = setInterval(() => {
            if (counter > 0 && counter % 5 === 0) {
                setCurrentWord(language === "es" ? "UNIDAD" : "UNIT");
            } else {
                setCurrentWord(words[index]);
                index = (index + 1) % words.length;
            }

            counter++;
        }, 2000);

        return () => clearInterval(interval);
    }, [words, language]);

    return currentWord;
}
