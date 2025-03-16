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
        <div className="flex flex-col min-h-screen">
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
        <div className="flex flex-col min-h-screen">
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

                <div>
                    <Slogan />
                    <p>
                        {translations.description ||
                        "The Advanced Guidance Assistant designed to support you in managing daily tasks and maintaining a structured, balanced lifestyle."}
                    </p>

                    <button>{translations.button?.aboutUs || "About Us"}</button>
                </div>
            </main>

            <Footer className="mt-auto" />
        </div>
    );
}