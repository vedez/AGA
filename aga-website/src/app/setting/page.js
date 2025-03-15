"use client";

import useTranslation from "@/hooks/useTranslation";
import Logo from "@/app/components/Logo";
import Footer from "@/app/components/Footer";
import ShortNav from "@/app/components/ShortNav";
import ProfilePhoto from "@/app/components/ProfilePhoto";
import AccountSetting from "@/app/components/AccountSetting";


export default function Help() {
    const { language, setLanguage, translations } = useTranslation();

    return (
        <main>
            <div>
                <Logo />
                <ShortNav />
            </div>

            <div>
                <ProfilePhoto />
                <AccountSetting />
            </div>
            <div>
                
            </div>
            <Footer />
        </main>
    );
}
