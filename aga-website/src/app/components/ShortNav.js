"use client";

import useTranslation from "@/hooks/useTranslation";
import { useAuth } from "@/app/utils/AuthContext";
import ProfileIcon from "@/app/components/ProfileIcon"
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import RegisterLogin from "@/app/components/RegisterLogin";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdLogout } from "react-icons/md";
import { FaHome } from "react-icons/fa";

export default function Navbar() {
    const { translations } = useTranslation();
    const { logout, currentUser } = useAuth();
    const router = useRouter();
  
    const handleLogout = async () => {
      try {
        await logout();
        router.push("/");
      } catch (error) {
        console.error("Unable to Logout due to system error. Try again.", error);
      }
    };

    return(
        <div className="center gap-x-3">
            <div className="space-x-5 font-semibold hide">
                <Link href="/main" className="text-link">
                    {translations.button?.home || "Home"}
                </Link>

                <Link href="/about" className="text-link">
                    {translations.button?.about || "About"}
                </Link>
            </div>

            <div className="horizontal-flex ">
                {currentUser ? (
                    <>
                        <div><ProfileIcon /></div>
                        <div><FaHome size={20} className="sm:hidden inline-block horizontal-flex" /></div>

                        <button
                            onClick={handleLogout}
                            className="p-0 m-0 text-xs flex items-center gap-1 text-link hover:text-red-500 transition-colors"
                        >
                            <h6>{translations.button?.logout || "Logout"}</h6>
                            <MdLogout className="w-4 h-4" title="Log Out" />
                        </button>
                    </>
                ): (
                    <RegisterLogin />
                )}
                <LanguageSwitcher />
            </div>
        </div>
    );
}