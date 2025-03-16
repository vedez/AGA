import useTranslation from "@/hooks/useTranslation";

export default function Calendar() {
    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();

    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => {
        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const fullDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return { weekday, fullDate };
    };

    const todayData = formatDate(today);
    const yesterdayData = formatDate(yesterday);
    const tomorrowData = formatDate(tomorrow);

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
            <div className="text-[#ffffff] text-2xl text-bg-shadow">
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
