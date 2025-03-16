"use client";

import useTranslation from "@/hooks/useTranslation";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import Logo from "@/app/components/Logo";
import RegisterLogin from "@/app/components/RegisterLogin";
import Slogan from "@/app/components/Slogan";
import Footer from "@/app/components/Footer";
import UserProfile from "@/app/components/UserProfile";
import { useAuth } from "@/app/utils/AuthContext";

export default function Home() {
    const { translations } = useTranslation();
    const { currentUser } = useAuth();

    return (
        <div className="flex flex-col screen-size">
            <main className="flex-grow">
                <div className="center">
                    <Logo />
                    <div className="horizontal-flex">
                        {currentUser ? (
                            <UserProfile />
                        ) : (
                            <RegisterLogin />
                        )}
                        <LanguageSwitcher/>
                    </div>
                </div>
                <div className="flex items-center justify-start h-full">

                <div className="w-full max-w-l">
                    <Slogan />

                    <p className="text-[#1f697c] text-bg-light-shadow leading-relaxed text-m py-4 max-w-md">
                        {translations.description ||
                        "The Advanced Guidance Assistant is designed to help you manage daily tasks and maintain a structured, balanced lifestyle, empowering you to unlock your full potential."}
                    </p>

                    <button className="third-button">{translations.button?.aboutUs || "About Us"}</button>
                </div>
            </div>

            </main>
            <Footer className="mt-auto" />
        </div>
    );
}