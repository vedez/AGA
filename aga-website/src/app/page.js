"use client";

import useTranslation from "@/hooks/useTranslation";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import Logo from "@/app/components/Logo";
import RegisterLogin from "@/app/components/RegisterLogin";
import Slogan from "@/app/components/Slogan";
import Footer from "@/app/components/Footer";

export default function Home() {
    const { translations } = useTranslation();

    return (
        <main>
            <div className="center">
                <Logo />
                <div className="horizontal-flex">
                    <RegisterLogin />
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

            <Footer />
        </main>
    );
}
