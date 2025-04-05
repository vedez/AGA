import { useState } from "react";
import { MdCamera } from "react-icons/md";
import useTranslation from "@/hooks/useTranslation";

export default function FocusMode() {
    const [showMessage, setShowMessage] = useState(false);
    const {translations} = useTranslation();

    const handleClick = () => {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000); // message disappears after 2s
    };

    return (
        <div className="w-full">
            <div
            onClick={handleClick}
            className="h-18 cursor-pointer bg-gradient-to-r from-[#2f313a] to-[#5b606d] border-[#2f313a] border-2 text-white text-lg font-bold feature-element no-margin flex items-center justify-center rounded"
            >
                <MdCamera size={30} />
            </div>

            {showMessage && (
                <div className="absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded shadow-md animate-fade text-center">
                    {translations.feature?.underDevelopment || "This feature is under development"}
                </div>
            )}
        </div>
    );
}
