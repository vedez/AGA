"use client";

import useTranslation from "@/hooks/useTranslation";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import CreateAccount from "@/app/components/CreateAccount";
import Login from "@/app/components/Login";
import Logo from "@/app/components/Logo";
import DesignLogo from "@/app/components/DesignLogo";
import Footer from "@/app/components/Footer";

export default function Account() {
    const { language, setLanguage, translations } = useTranslation();

    return (
        <main>
            <div>
                <Logo />
                <LanguageSwitcher />
            </div>

            <div>
                <DesignLogo />
            
                <div>
                    <div>
                        <CreateAccount />
                    </div>
                    <div>
                        <Login />
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
