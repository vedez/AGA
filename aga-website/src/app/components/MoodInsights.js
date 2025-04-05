"use client";

import useTranslation from "@/hooks/useTranslation";
import { useState } from "react";
import { FaSadTear, FaMeh, FaAngry, FaSmileBeam } from "react-icons/fa";
import {FaFaceGrinTongueSquint} from "react-icons/fa6"
import { IoCloseCircleOutline } from "react-icons/io5";

// define emoji components with both regular and enlarged sizes
const moodEmojis = [
    { icon: (isSelected) => <FaAngry className="text-[#d43f2b] transition-all duration-200" size={isSelected ? 42 : 30} />, value: 1 },
    { icon: (isSelected) => <FaSadTear className="text-[#bd3ed1] transition-all duration-200" size={isSelected ? 42 : 30} />, value: 2 },
    { icon: (isSelected) => <FaMeh className="text-[#e98132] transition-all duration-200" size={isSelected ? 42 : 30} />, value: 3 },
    { icon: (isSelected) => <FaSmileBeam className="text-[#f1b234] transition-all duration-200" size={isSelected ? 42 : 30} />, value: 4 },
    { icon: (isSelected) => <FaFaceGrinTongueSquint className="text-[#369b29] transition-all duration-200" size={isSelected ? 42 : 30} />, value: 5 }
];

export default function MoodPromptModal() {
    const [showModal, setShowModal] = useState(false);
    const [moodValue, setMoodValue] = useState(3);
    const [submitted, setSubmitted] = useState(false);
    const { translations } = useTranslation();

    const logMood = (value) => {
        const now = new Date();
        const logs = JSON.parse(localStorage.getItem("mood_logs")) || [];

        logs.push({
            date: now.toISOString(),
            mood: value
        });

        localStorage.setItem("mood_logs", JSON.stringify(logs));
    };
  

    const handleSubmit = () => {
        logMood(moodValue);
        setSubmitted(true);

        setTimeout(() => {
            setShowModal(false);
            setSubmitted(false);
        }, 1500);
    };

  return (
    <>
        <button onClick={() => setShowModal(true)}
            className="relative overflow-hidden group text-white font-bold px-4 py-2 pb-4 lg:pb-2 rounded border border-[#a6e5dd] shadow-md drop-shadow-sm bg-gradient-to-r from-[#86e69e] to-[#71d191]">
            <span className="relative z-10 text-bg-shadow">{translations.mood?.mood_log || "Log Mood"}</span>
            <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200 z-0" />
        </button>


      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl p-6 max-w-sm text-center shadow-lg w-[90%]">
                <div className="flex justify-end mb-2">
                    <button 
                        onClick={() => setShowModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close modal"
                    >
                        <IoCloseCircleOutline size={24} />
                    </button>
                </div>
                
                {!submitted ? (
                    <>
                        <h2 className="text-xl font-semibold mb-3">{translations.mood?.question || "How are you feeling Today?"}</h2>
                        <p className="text-sm text-gray-600 mb-4 italic">
                            {translations.mood?.slider || "Find what mood best describes you."}
                        </p>

                        <div className="flex justify-between text-2xl px-2 mb-4 items-end h-[50px]">
                            {moodEmojis.map((emoji, index) => (
                                <span key={index} className="transition-transform duration-200 flex items-end">
                                    {emoji.icon(emoji.value === moodValue)}
                                </span>
                            ))}
                        </div>

                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={moodValue}
                            onChange={(e) => setMoodValue(parseInt(e.target.value))}
                            className="w-full mb-4 mood-range-slider"
                        />

                        <button onClick={handleSubmit} className="third-button w-full">
                            {translations.forms?.submit || "Submit"}
                        </button>
                    </>
                ) : (
                    <div className="text-[#41963b] ">
                        {translations.mood?.success || "Your mood has been logged successfully. Have a great day today!"}
                    </div>
                )}
            </div>
        </div>
      )}
    </>
  );
}
