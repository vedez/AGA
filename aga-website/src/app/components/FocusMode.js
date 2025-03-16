import useTranslation from "@/hooks/useTranslation";

export default function FocusMode() {
    const { language, setLanguage, translations } = useTranslation();

    return(
        <div className="bg-gradient-to-r from-[#2f313a] to-[#5b606d] border-[#2f313a] border-2 text-white text-l font-bold feature-element">
            <h1 className="text-center bg-[#5b606d] p-1 border-4 border-[#2f313a] rounded-lg ">Work in Progress...</h1>
        </div>
    );
}