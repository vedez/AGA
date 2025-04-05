"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import useTranslation from "@/hooks/useTranslation";

// retrieve last N week-start dates (Mondays)
function getLastNWeekStarts(n) {
    const mondays = []; 
    const today = new Date(); 
    const day = today.getDay(); 

    // getDay gives 0 for sunday, 1 for monday, etc.
    const offset = (day === 0 ? -6 : 1) - day;
    // if it's sunday, go back 6 days
    // otherwise, go back to monday
    let monday = new Date(today.setDate(today.getDate() + offset));

    // shift today by the offset to get the most recent monday
    for (let i = 0; i < n; i++) {
        const date = new Date(monday); // copy the monday date
        date.setDate(monday.getDate() - i * 7); // go back i weeks
        mondays.unshift(date); // add to front of array so it's oldest to newest
    }

    return mondays; // return the array of monday dates
    
}

function formatWeekLabel(date, translations) {
    return `${translations["week_of"]} ${String(date.getMonth() + 1).padStart(2, "0")}/${String(
        date.getDate()
    ).padStart(2, "0")}`;
  }  

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MoodGraph() {
    const { language, translations } = useTranslation();
    const [data, setData] = useState([]);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const moodLogs = JSON.parse(localStorage.getItem("mood_logs")) || [];
      
        if (!moodLogs.length) {
            setHasData(false);
            return;
        }
      
        const weekStarts = getLastNWeekStarts(4);
        const grouped = {};
      
        moodLogs.forEach(({ date, mood }) => {
            const d = new Date(date); 
            // convert the saved date string to a date object
          
            const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
            // get index for day name (0 = sunday, so shift it to 6)
          
            const dayName = days[dayIndex];
            // get the name like "mon", "tue", etc.
          
            const weekKey = weekStarts.find((start) => {
                const end = new Date(start);
                end.setDate(end.getDate() + 7);
                // define the range: monday to next monday
            
                return d >= start && d < end;
                // check if the log date falls in this week
            });
          
            if (!weekKey) return;
            // if the date doesn't fall in the last 4 weeks, skip it
          
            const key = formatWeekLabel(weekKey, translations);
            // label for the week, like "week of 04/01"
          
            if (!grouped[key]) grouped[key] = {};
            // if this week group doesn't exist yet, create it
          
            if (!grouped[key][dayName]) grouped[key][dayName] = [];
            // if there's no entry for this day in the week, make one
          
            grouped[key][dayName].push(mood);
            // add the mood to the list for that day
        });
          
      
        const formatted = days.map((day) => {
            const entry = { day };
        
            weekStarts.forEach((weekStart) => {
                const label = formatWeekLabel(weekStart, translations);
                const moods = grouped[label]?.[day];
            
                if (moods && moods.length) {
                    const avg = moods.reduce((sum, v) => sum + v, 0) / moods.length;
                    entry[label] = Math.round(avg);
                } else {
                    entry[label] = 3;
                }
            });
        
            return entry;
        });
      
        setData(formatted);
        setHasData(true);
    }, [translations]); // add translations as a dependency
      

  if (!hasData) return null;

  return (
    <div className="w-full h-full">
        <div className="bg-[#f0fcf0] rounded-lg shadow-md w-full h-full">
            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height={320} aspect={undefined}>
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 50, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="day"
                            interval={0}

                            tick={({ x, y, payload }) => {
                                const dayName = payload.value;
                                const dummyDate = new Date();
                                const index = days.indexOf(dayName);
                                dummyDate.setDate(dummyDate.getDate() - dummyDate.getDay() + 1 + index);

                                const localized = dummyDate.toLocaleDateString(language || "en", {
                                    weekday: "short"
                                });

                                return (
                                    <g transform={`translate(${x},${y + 10})`}>
                                        <text
                                            textAnchor="middle"
                                            className="text-xs"
                                            style={{ fill: "#666" }}
                                        >
                                            {localized}
                                        </text>
                                    </g>
                                );
                            }}
                        />
                        <YAxis 
                            domain={[1, 5]} 
                            ticks={[1, 2, 3, 4, 5]} 
                            interval={0}
                        />

                        <Tooltip />

                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            wrapperStyle={{
                                paddingTop: "5px",
                                fontSize: "11px",
                                textAlign: "center",
                                width: "100%"
                        }}
                        />

                        {Object.keys(data[0] || {})
                            .filter((key) => key !== "day")

                            .map((weekKey, i) => (
                                <Line
                                    key={weekKey}
                                    type="monotone"
                                    dataKey={weekKey}
                                    stroke={["#0066CC", "#EDB120", "#DC143C", "#5E40BE"][i % 4]}
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 5 }}
                                    isAnimationActive={true}
                                />
                            ))
                        }
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
}
