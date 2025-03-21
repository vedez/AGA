"use client";

import useTranslation from "@/hooks/useTranslation";
import useAccountMode from "@/hooks/useAccountMode";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import CreateAccount from "@/app/components/CreateAccount";
import Login from "@/app/components/Login";
import DesignLogo from "@/app/components/DesignLogo";

export default function Account() {
    const { language, setLanguage, translations } = useTranslation();
    const { activeMode, switchMode } = useAccountMode();

    return (
        <main className="flex h-screen w-screen overflow-hidden">
            {/* Left side with logo - hidden on mobile */}
            <div className="hide sm:flex sm:w-1/2 bg-[#70C1D3] flex-col justify-center items-center">
                <DesignLogo />
            </div>
            
            {/* Right side with form - full width on mobile */}
            <div className="w-full sm:w-1/2 bg-white flex flex-col">
                {/* Language switcher in top right */}
                <div className="flex justify-end p-4">
                    <LanguageSwitcher />
                </div>
                
                {/* Form container */}
                <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12">
                    {activeMode === "create" ? (
                        <div className="w-full max-w-md">
                            <h1 className="form-title">
                                {translations.account?.createNewAccount || "Create new Account"}
                            </h1>
                            <p className="form-subtitle" onClick={switchMode}>
                                {translations.account?.alreadyRegistered || "Already Registered? Login"}
                            </p>
                            <CreateAccount />
                        </div>
                    ) : (
                        <div className="w-full max-w-md">
                            <h1 className="form-title">
                                {translations.account?.signin || "Sign In"}
                            </h1>
                            <p className="form-subtitle" onClick={switchMode}>
                                {translations.account?.notRegiestered || "New member? Sign Up"}
                            </p>
                            <Login />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
