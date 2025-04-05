import useTranslation from "@/hooks/useTranslation";
import { FaTasks } from "react-icons/fa";
import { MdCamera } from "react-icons/md";
import { TiWeatherSunny } from "react-icons/ti";
import { TbMoodHeart } from "react-icons/tb";


export default function ToolInfo() {
    const { translations } = useTranslation();

    return(
        <div>
            <h1 className="text-center text-xl font-bold mb-5" id="#tool-information">{translations.components?.toolInfo || "Tool Information"}</h1>

            <div className="flex flex-col gap-5 w-full sm:w-[70%] mx-auto">
                <div className="rounded-lg bg-gradient-to-r from-[#5074b5] to-[#47c8b5] text-white p-4 sm:px-6 sm:mx-40">
                    <div className="horizontal-flex gap-2 w-full">
                        <FaTasks className="text-3xl" />
                        
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <h2 className="font-bold text-m">{translations.about?.feature_task_tracker || "Task Setter"}</h2>

                            <p className="text-sm break-words">
                                {translations.tool?.tasksetter_explaination || "Task Setter helps you manage tasks based on priority and daily focus. On the home screen, Task Setter shows you the top 3 priority tasks for today to help you focus on one task at a time. It also previews the top 3 tasks for tomorrow so you can stay prepared and plan ahead."}<br /><br />
                                {translations.tool?.tasksetter_explaination2 || "To add a task, click the [+] icon, then enter a description, set a priority from 1–5 (with 1 being the most important), and choose a due date. "}
                                {translations.tool?.tasksetter_explaination3 || "Once added, tasks appear on the home screen if they're due today or tomorrow. You can mark tasks as complete by clicking the check icon."}<br /><br />
                                {translations.tool?.tasksetter_explaination4 || "All active and completed tasks are stored in the task backlog, accessible from Settings. From there, you can edit the task’s description, priority, or date, or delete tasks you no longer need. Missed tasks will appear greyed out and can be rescheduled or removed."}<br />
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-gradient-to-r from-[#db9457] to-[#ea6e50] text-white p-4 sm:px-6 sm:mx-40">
                    <div className="horizontal-flex gap-2 w-full">
                        <MdCamera className="text-3xl" />
                        
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <h2 className="font-bold text-m">{translations.about?.feature_focus_mode || "Focus Mode"}</h2>

                            <p className="text-sm break-words">
                                {translations.tool?.focusmode_explaination || "Focus Mode is a smart feature built into the physical AGA bot that helps you stay engaged and intentional while working or studying. Simply place the bot in front of you and begin your task."}<br /><br />
                                {translations.tool?.focusmode_explaination2 || "It uses body language detection to recognise when you’re distracted, gently alerting you to refocus on the task at hand. On the flip side, if you've been working for 30 minutes straight, the bot will suggest taking a break to avoid burnout."}<br /><br />
                                {translations.tool?.focusmode_explaination3 || "You can ignore the break suggestion up to three times, but after that, the bot will enforce a minimum 15-minute break to support your mental wellbeing. It’s designed not just to keep you productive — but to help you maintain a healthy, sustainable workflow."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-gradient-to-r from-[#5cb550] to-[#58c797] text-white p-4 sm:px-6 sm:mx-40">
                    <div className="horizontal-flex gap-2 w-full">
                        <TiWeatherSunny className="text-3xl" />
                        
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <h2 className="font-bold text-m">{translations.about?.feature_calendar_weather || "Calendar and Weather"}</h2>

                            <p className="text-sm break-words">
                                {translations.tool?.calendar_weather_explaination || "The AGA web app features an integrated calendar and weather tool to support your daily routine. It's designed for moments when you forget the date or feel unsure about the weather — giving you an always-accessible, real-time snapshot of what matters most."}<br /><br />
                                {translations.tool?.calendar_weather_explaination2 || "The calendar highlights yesterday, today, and tomorrow — emphasising the rhythm of reflection, action, and preparation. We learn from the past, focus on today, and get ready for what’s next."}<br /><br />
                                {translations.tool?.calendar_weather_explaination3 || "The weather tool is powered by AI to offer smart suggestions — like reminding you to take an umbrella if it’s going to rain — helping you prepare for the day ahead without needing to check manually."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-gradient-to-r from-[#b04cad] to-[#674ee2] text-white p-4 sm:px-6 sm:mx-40">
                    <div className="horizontal-flex gap-2 w-full">
                        <TbMoodHeart className="text-3xl" />
                        
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <h2 className="font-bold text-m">{translations.about?.feature_wellbeing_insights || "Mood Insights"}</h2>

                            <p className="text-sm break-words">
                                {translations.tool?.wellbeing_explaination || "This upcoming feature will expand AGA’s focus on mental wellbeing, offering tools and guidance to help users learn how to regulate their mental health. It will encourage self-investment through practices like breathing techniques and self-care exercises — helping users reconnect with themselves and build healthy routines."}<br /><br />
                                {translations.tool?.wellbeing_explaination2 || "For now, the Mood Insight tool is live. You can set your mood daily, with mood prompts appearing at three key points throughout the day: 6AM–12PM, 12PM–6PM, 6PM–12AM"}<br /><br />
                                {translations.tool?.wellbeing_explaination || "Mood entries are analysed over time, offering a weekly mood overview (up to 4 weeks), helping you understand what affects your emotional state and how to respond to it with intention. Your personalised mood trends can be found on the main page."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}