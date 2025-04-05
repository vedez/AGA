"use client";

import { useState } from "react";

const moodEmojis = ["😞", "😕", "😐", "🙂", "😄"];

export default function MoodPromptModal() {
  const [showModal, setShowModal] = useState(false);
  const [moodValue, setMoodValue] = useState(3);
  const [submitted, setSubmitted] = useState(false);

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
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => setShowModal(true)}
      >
        Log Mood
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center shadow-lg w-[90%]">
            {!submitted ? (
              <>
                <h2 className="text-xl font-semibold mb-3">How are you feeling?</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Slide to choose your mood.
                </p>

                <div className="flex justify-between text-2xl px-2 mb-4">
                  {moodEmojis.map((emoji, index) => (
                    <span key={index}>{emoji}</span>
                  ))}
                </div>

                <input
                  type="range"
                  min="1"
                  max="5"
                  value={moodValue}
                  onChange={(e) => setMoodValue(parseInt(e.target.value))}
                  className="w-full mb-4"
                />

                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Submit Mood
                </button>
              </>
            ) : (
              <div className="text-green-600 font-semibold text-lg">
                Mood logged ✅
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
