"use client";

import useTranslation from "@/hooks/useTranslation";
import useAccountMode from "@/hooks/useAccountMode";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import CreateAccount from "@/app/components/CreateAccount";
import Login from "@/app/components/Login";
import DesignLogo from "@/app/components/DesignLogo";
import Footer from "@/app/components/Footer"; 

export default function Account() {
    const { language, setLanguage, translations } = useTranslation();
    const { activeMode, switchMode } = useAccountMode();

    return (
        <main>
            <div className="flex justify-end">
                <LanguageSwitcher />
            </div>

            <div className="flex w-full h-screen">
                <div className="flex-1 flex justify-center items-center">
                    <div>
                        <DesignLogo />
                    </div>
                </div>
                
                <div className="flex-1 flex justify-center items-center">
                    {activeMode === "create" ? (
                        <div>
                            <h1>{translations.createNewAccount || "Create New Account"}</h1>
                            <button onClick={switchMode}>{translations.alreadyRegistered || "Already Registered? Login"}</button>
                            <CreateAccount />
                        </div>
                    ) : (
                        <div>
                            <h1>{translations.signin || "Sign In"}</h1>
                            <button onClick={switchMode}>{translations.notRegiestered || "New member? Sign Up"}</button>
                            <Login />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
