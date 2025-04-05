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

// Get last N week-start dates (Mondays)
function getLastNWeekStarts(n) {
  const mondays = [];
  const today = new Date();
  const day = today.getDay();
  const offset = (day === 0 ? -6 : 1) - day;
  let monday = new Date(today.setDate(today.getDate() + offset));

  for (let i = 0; i < n; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() - i * 7);
    mondays.unshift(date);
  }
  return mondays;
}

function formatWeekLabel(date) {
  return `Week of ${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MoodGraph() {
  const { language } = useTranslation();
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
      const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
      const dayName = days[dayIndex];

      const weekKey = weekStarts.find((start) => {
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return d >= start && d < end;
      });

      if (!weekKey) return;
      const key = formatWeekLabel(weekKey);

      if (!grouped[key]) grouped[key] = {};
      if (!grouped[key][dayName]) grouped[key][dayName] = [];

      grouped[key][dayName].push(mood);
    });

    const formatted = days.map((day) => {
      const entry = { day };

      weekStarts.forEach((weekStart) => {
        const label = formatWeekLabel(weekStart);
        const moods = grouped[label]?.[day];

        if (moods && moods.length) {
          const avg = moods.reduce((sum, v) => sum + v, 0) / moods.length;
          entry[label] = Math.round(avg);
        } else {
          entry[label] = 3; // default mood if no entry
        }
      });

      return entry;
    });

    setData(formatted);
    setHasData(true);
  }, []);

  if (!hasData) return null;

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-full sm:max-w-7xl overflow-x-auto">
        <h2 className="text-xl font-semibold text-center mb-4">
          Mood Trends (Past 4 Weeks)
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[350px] sm:min-w-[600px] md:min-w-[700px]">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={data}
                margin={{ top: 10, right: 30, left: 30, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
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
                          className="text-[10px] sm:rotate-0 rotate-90 origin-top sm:origin-center"
                          style={{ fill: "#666" }}
                        >
                          {localized}
                        </text>
                      </g>
                    );
                  }}
                />
                <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ marginTop: "20px" }}
                />

                {Object.keys(data[0] || {})
                  .filter((key) => key !== "day")
                  .map((weekKey, i) => (
                    <Line
                      key={weekKey}
                      type="monotone"
                      dataKey={weekKey}
                      stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"][i % 4]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
