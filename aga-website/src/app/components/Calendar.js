import useTranslation from "@/hooks/useTranslation";
import useCalender from "@/hooks/useCalender";

export default function Calendar() {
    const { todayData, yesterdayData, tomorrowData } = useCalender();

    return (
        <div className="bg-gradient-to-r from-[#e56baa] to-[#ffd176] border-[#e56baa] border-2 flex flex-col items-center space-y-2 feature-element">
            {/* Yesterday */}
            <div className="text-[#91205a] drop-shadow-md">
                <p className="text-center">
                    <span className="font-semibold">{yesterdayData.weekday} | </span> 
                    {yesterdayData.fullDate}
                </p>
            </div>

            {/* Today */}
            <div className="text-[#ffffff] text-xl text-bg-shadow">
                <p className="text-center font-bold">
                    <span>{todayData.weekday} | </span> 
                    {todayData.fullDate}
                </p>
            </div>

            {/* Tomorrow */}
            <div className="text-[#91205a] drop-shadow-md">
                <p className="text-center">
                    <span className="font-semibold">{tomorrowData.weekday} | </span> 
                    {tomorrowData.fullDate}
                </p>
            </div>
        </div>
    );
}
