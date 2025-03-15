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
            <div className="flex justify-end">
                <LanguageSwitcher />
            </div>

            <div className="horizontal-flex">
                <DesignLogo />
                <div>
                    <div>
                        <CreateAccount />
                        create
                    </div>
                    <div>
                        <Login />
                        login
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
