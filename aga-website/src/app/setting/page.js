"use client";

import usePageBackground from "@/hooks/usePageBackground";
import ProtectedRoute from "@/app/utils/ProtectedRoute";
import Logo from "@/app/components/Logo";
import Footer from "@/app/components/Footer";
import ShortNav from "@/app/components/ShortNav";
import ProfilePhoto from "@/app/components/ProfilePhoto";
import AccountSetting from "@/app/components/AccountSetting";

export default function Setting() {
    usePageBackground('SECONDARY', 0.7);
    return (
        <ProtectedRoute>
            <div className="flex flex-col screen-size">
                <div className="center">
                    <Logo />
                    <ShortNav />
                </div>
                
                <div className="flex items-center justify-center flex-grow ">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-12 max-w-4xl w-full m-6">
                        <ProfilePhoto/>
                        <AccountSetting />
                    </div>
                </div>

                <Footer className="mt-auto"/>
            </div>
        </ProtectedRoute>
    );
}










