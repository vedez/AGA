"use client";

import useTranslation from "@/hooks/useTranslation";
import Logo from "@/app/components/Logo";
import Footer from "@/app/components/Footer";
import ShortNav from "@/app/components/ShortNav";
import ProfilePhoto from "@/app/components/ProfilePhoto";
import AccountSetting from "@/app/components/AccountSetting";
import { useAuth } from "@/app/utils/AuthContext";

export default function Setting() {
    const { translations } = useTranslation();
    const { currentUser } = useAuth();

    return (
        <div className="flex flex-col screen-size">
            {/* Header */}
            <div className="center">
                <Logo />
                <ShortNav />
            </div>
            
            <div className="flex items-center justify-center flex-grow ">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-12 max-w-4xl w-full m-6">
                    {/* Profile Photo Section */}
                    <ProfilePhoto/>

                    {/* Form Section */}
                    <AccountSetting />
                </div>
            </div>

            {/* Footer */}
            <Footer className="mt-auto"/>
        </div>
    );
}










