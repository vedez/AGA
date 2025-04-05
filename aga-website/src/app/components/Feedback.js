"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/utils/AuthContext';
import { db, collection, query, where, getDocs, orderBy, limit } from '@/app/utils/firebase';
import useTranslation from '@/hooks/useTranslation';

export default function Feedback({ refreshTrigger }) {
    const [loading, setLoading] = useState(true);
    const [moodLevel, setMoodLevel] = useState('medium'); // default to medium
    const [affirmation, setAffirmation] = useState('');
    const { currentUser } = useAuth();
    const { language, translations } = useTranslation();

    // get affirmations based on mood level
    const getAffirmation = (level) => {
        const affirmations = translations.affirmations?.[level] || [];
        
        if (affirmations.length === 0) {
            // fallback for if translations aren't available for some reason
            const fallbackAffirmations = {
                high: [
                    "You're doing amazing! Keep up your positive energy!",
                    "Your happiness is contagious - spread the joy!",
                    "What a great outlook you have today! Wonderful!"
                ],
                medium: [
                    "You're doing well! Take a moment to appreciate yourself.",
                    "Balance is key, and you're finding it today.",
                    "Steady and calm - you've got this!"
                ],
                low: [
                    "It's okay to have tough days. Tomorrow will be better.",
                    "Your feelings are valid. Be gentle with yourself today.",
                    "Even small steps forward count as progress. You're doing great."
                ]
            };
            
            const options = fallbackAffirmations[level] || fallbackAffirmations.medium;
            return options[Math.floor(Math.random() * options.length)];
        }
        
        // return a random affirmation from the selected level
        return affirmations[Math.floor(Math.random() * affirmations.length)];
    };

    useEffect(() => {
        async function getTodaysMood() {
            if (!currentUser) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            
            try {
                // get today's start date
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                // query Firestore for today's moods
                const moodLogsRef = collection(db, "mood_logs");
                const q = query(
                    moodLogsRef,
                    where("userId", "==", currentUser.uid),
                    where("date", ">=", today),
                    orderBy("date", "desc")
                );
                
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    // no moods logged today, use medium as default
                    setMoodLevel('medium');
                } else {
                    // calculate average mood for today
                    let totalMood = 0;
                    querySnapshot.forEach(doc => {
                        totalMood += doc.data().mood;
                    });
                    
                    const avgMood = totalMood / querySnapshot.size;
                    
                    // categorize the mood
                    if (avgMood >= 4) {
                        setMoodLevel('high');
                    } else if (avgMood <= 2) {
                        setMoodLevel('low');
                    } else {
                        setMoodLevel('medium');
                    }
                }
            } catch (error) {
                console.error("Error fetching mood data:", error);
                setMoodLevel('medium'); // default to medium on error
            } finally {
                setLoading(false);
            }
        }
        
        getTodaysMood();
    }, [currentUser, refreshTrigger]);
    
    // update affirmation when mood level changes or language changes
    useEffect(() => {
        setAffirmation(getAffirmation(moodLevel));
    }, [moodLevel, translations]);

    if (loading) {
        return (
            <div className='bg-[#f4f1ff] text-[#303037] text-center feature-element flex justify-center items-center'>
                <div className="animate-pulse">{translations.mood?.affirmationLoading || "Loading your affirmation..."}</div>
            </div>
        );
    }

    return (
        <div className={`text-center feature-element p-4 ${
            moodLevel === 'high' 
                ? 'bg-[#e5ffe5] text-[#1e6e1e]' 
                : moodLevel === 'low' 
                    ? 'bg-[#fff0f0] text-[#8b2323]' 
                    : 'bg-[#ffe8d2] text-[#c26f2c]'
        }`}>
            <div className="font-medium text-lg">"{affirmation}"</div>
        </div>
    );
}