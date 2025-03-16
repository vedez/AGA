"use client";

import useTranslation from "@/hooks/useTranslation";
import { FaUserCircle } from "react-icons/fa";

export default function ProfilePhoto() {
    const { translations } = useTranslation();

    return(
        <div className="flex flex-col items-center">
            <div className="w-70 h-70 rounded-full flex items-center justify-center">
                <FaUserCircle size={180} className="text-gray-700 m-5" />
            </div>
            <button className="main-button">
                {translations.profile?.changePhoto || "CHANGE PHOTO"}
            </button>
        </div>
    );
}