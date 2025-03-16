"use client";

import { useEffect, useState } from "react";
import useTranslation from "@/hooks/useTranslation";

export default function Slogan() {
    const { translations } = useTranslation();
    const [currentWord, setCurrentWord] = useState("UNIT");
    const [words, setWords] = useState([]);

    useEffect(() => {
        // Load words from JSON file
        const fetchWords = async () => {
            try {
                const res = await fetch("/json/unit.json");
                const data = await res.json();
                setWords(data.unit);
            } catch (error) {
                console.error("Failed to load words:", error);
            }
        };

        fetchWords();
    }, []);

    useEffect(() => {
        if (words.length > 0) {
            let index = 0;
            let counter = 0;

            const interval = setInterval(() => {
                // Every 5th word, reset to "UNIT"
                if (counter > 0 && counter % 5 === 0) {
                    setCurrentWord("UNIT");
                } else {
                    setCurrentWord(words[index]);
                    index = (index + 1) % words.length;
                }

                counter++;
            }, 2000); // Change word every 2 seconds

            return () => clearInterval(interval);
        }
    }, [words]);

    return (
        <div className="text-[#3d9cb4] text-5xl sm:text-6xl font-bold">
            <h2>
                ONE 
                <span id="changing-word" className="text-[#67d360] transition-opacity duration-500 ease-in-out"> {currentWord} </span>
            </h2>
            <h2>
                AT A TIME
            </h2>
        </div>
    );
}
