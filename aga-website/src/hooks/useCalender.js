
const formatDate = (date) => {
    const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
    const fullDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return { weekday, fullDate };
};

export default function useCalender() {
    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();

    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);

    const todayData = formatDate(today);
    const yesterdayData = formatDate(yesterday);
    const tomorrowData = formatDate(tomorrow);

    return { todayData, yesterdayData, tomorrowData };
}
