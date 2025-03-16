import useTranslation from "@/hooks/useTranslation";

export default function TaskSetter() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div className="flex flex-col">
            <div className="bg-gradient-to-r from-[#6590df] to-[#adf0f9] border-[#6590df] border-2 text-white text-l font-bold feature-element text-bg-shadow">
                <h1 className="text-center">Today</h1>
            </div>

            <div className="bg-gradient-to-r from-[#ffa871] to-[#f9e0ad] border-[#df9465] border-2 text-[#fff] text-l font-bold feature-element text-bg-shadow">
                <h1 className="text-center">Tomorrow</h1>
            </div>
        </div>
    );
}