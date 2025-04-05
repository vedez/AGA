"use client";

import useTranslation from "@/hooks/useTranslation";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/utils/AuthContext";

export default function ProfileIcon() {
    const { translations } = useTranslation();
    const router = useRouter();
    const { currentUser } = useAuth();

    const handleProfileClick = () => {
        if (currentUser) {
            router.push("/setting");
        } else {
            router.push("/account");
        }
    };

    return(
        <button 
            id="profile-icon-button"
            onClick={handleProfileClick}
            className="bg-transparent border-none cursor-pointer flex items-center justify-center p-0"
            aria-label={translations.profile?.settings || "Profile settings"}
            title={translations.profile?.settings || "Profile settings"}
        >
            <FaUserCircle className="text-gray-900 w-5 h-5 sm:w-[30px] sm:h-[30px]" />
        </button>
    );
}