"use client";

import useTranslation from "@/hooks/useTranslation";
import { FaUserCircle } from "react-icons/fa";

export default function ProfilePhoto() {
    const { translations } = useTranslation();

    return(
        <div className="flex flex-col items-center w-full sm:w-auto">
            <div className="rounded-full flex items-center justify-center mb-4">
                <FaUserCircle size={150} className="text-gray-700" />
            </div>
            <button className="main-button text-base py-2.5 px-5">
                {translations.profile?.changePhoto || "CHANGE PHOTO"}
            </button>
        </div>
    );
}