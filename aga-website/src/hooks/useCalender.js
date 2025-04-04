import useTranslation from "@/hooks/useTranslation";

export default function useCalender() {
    const { language } = useTranslation(); // 'en', 'es', etc.

    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();

    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);

    const todayData = formatDate(today, language);
    const yesterdayData = formatDate(yesterday, language);
    const tomorrowData = formatDate(tomorrow, language);

    return { todayData, yesterdayData, tomorrowData };
}

const formatDate = (date, locale) => {
    const weekday = date.toLocaleDateString(locale, { weekday: 'long' });
    const fullDate = date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    return { weekday, fullDate };
};

