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
import { useAuth } from "@/app/utils/AuthContext";
import { db, collection, query, where, getDocs, orderBy } from "@/app/utils/firebase";

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
    return `${translations["week_of"] || "Week of"} ${String(date.getMonth() + 1).padStart(2, "0")}/${String(
        date.getDate()
    ).padStart(2, "0")}`;
}  

// create empty data structure for when there are no mood logs
function createEmptyDataset(translations) {
    const weekStarts = getLastNWeekStarts(4);
    
    return days.map((day) => {
        const entry = { day };
        
        weekStarts.forEach((weekStart) => {
            const label = formatWeekLabel(weekStart, translations);
            entry[label] = null; // use null for all data points to show an empty graph
        });
        
        return entry;
    });
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MoodGraph({ refreshTrigger }) {
    const { language, translations } = useTranslation();
    const { currentUser } = useAuth();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMoodData, setHasMoodData] = useState(false);

    // function to fetch mood data
    const fetchMoodData = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // always create the empty dataset first as a fallback
            const emptyDataset = createEmptyDataset(translations);
            setData(emptyDataset);
            
            if (!currentUser) {
                setIsLoading(false);
                return;
            }
            
            // fetch from Firestore
            const fourWeeksAgo = new Date();
            fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
            
            const moodLogsRef = collection(db, "mood_logs");
            const q = query(
                moodLogsRef, 
                where("userId", "==", currentUser.uid),
                where("date", ">=", fourWeeksAgo),
                orderBy("date", "desc")
            );
            
            const querySnapshot = await getDocs(q);
            const moodLogs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                let dateValue;
                
                // handle server timestamp which might be null for newly created documents
                if (data.date && typeof data.date.toDate === 'function') {
                   
                    dateValue = data.date.toDate().toISOString();
                } else if (data.date) {
                    
                    dateValue = new Date(data.date).toISOString();
                } else {
                    
                    dateValue = (data.createdAt && typeof data.createdAt.toDate === 'function') 
                        ? data.createdAt.toDate().toISOString() 
                        : new Date().toISOString();
                }
                
                return {
                    id: doc.id,
                    date: dateValue,
                    mood: data.mood
                };
            });
            
            if (!moodLogs.length) {
                // if no mood logs, use the empty dataset
                setHasMoodData(false);
                setIsLoading(false);
                return;
            }
            
            setHasMoodData(true);
            
            const weekStarts = getLastNWeekStarts(4);
            const grouped = {};
            
            moodLogs.forEach(({ date, mood }) => {
                const d = new Date(date); 
                
                const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
                
                const dayName = days[dayIndex];
                
                const weekKey = weekStarts.find((start) => {
                    const end = new Date(start);
                    end.setDate(end.getDate() + 7);
                    
                    return d >= start && d < end;
                });
                
                if (!weekKey) return;
                
                const key = formatWeekLabel(weekKey, translations);
                
                if (!grouped[key]) grouped[key] = {};
                
                if (!grouped[key][dayName]) grouped[key][dayName] = [];
                
                grouped[key][dayName].push(mood);
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
                        entry[label] = null;
                    }
                });
            
                return entry;
            });
            
            setData(formatted);
        } catch (error) {
            console.error("Error fetching mood data:", error);
            setError(translations.mood?.moodLoadError || "Could not load mood data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // initial data load
    useEffect(() => {
        fetchMoodData();
    }, [currentUser, translations]);

    // trigger refresh when refreshTrigger changes
    useEffect(() => {
        if (refreshTrigger) {
            fetchMoodData();
        }
    }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3498db] mx-auto"></div>
          <p className="mt-2 text-gray-600">{translations.loading || "Loading..."}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
        <div className="bg-[#f0fcf0] rounded-lg shadow-md w-full h-full relative">
            {!hasMoodData && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="text-center">
                        <p className="text-gray-600">{translations.mood?.no_data || "No mood data yet"}</p>
                    </div>
                </div>
            )}
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
                                    connectNulls={true}
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
