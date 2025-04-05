"use client";

import { useState } from "react";
import MoodPromptModal from "./MoodInsights";
import MoodGraph from "./MoodGraph";
import Feedback from "./Feedback";

export default function MoodTracker() {
  // state to trigger refresh of the graph
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // handler for when a mood is logged
  const handleMoodLogged = (moodData) => {  
    // increment the refresh trigger to cause the MoodGraph to refresh
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 100);
  };

  return (
    <div className="flex flex-col gap-4">
      <MoodGraph refreshTrigger={refreshTrigger} />
      <div className="w-full">
        <MoodPromptModal onMoodLogged={handleMoodLogged} />
      </div>
      <Feedback refreshTrigger={refreshTrigger} />
    </div>
  );
} 