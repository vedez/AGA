"use client";

import useTranslation from "@/hooks/useTranslation";

export default function AccountSetting() {
    const { translations } = useTranslation();

    return(
        <div className="w-full mx-auto max-w-lg m-5">
            <div className="flex justify-center sm:justify-end mb-4">
                <button className="main-button rounded text-m">
                    {translations.profile?.saveChanges || "Save Changes"}
                </button>
            </div>
            
            <div className="clear-both space-y-5">
                <div className="mb-3">
                    <label className="block text-s mb-1">
                        {translations.forms?.enterFirstName || "Please enter your first name"}
                    </label>
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Jiara"
                    />
                </div>
                
                <div className="mb-3">
                    <label className="block text-s mb-1">
                        {translations.forms?.enterDob || "Please enter date of birth"}
                    </label>
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder="Month and Year"
                    />
                </div>
                
                <div className="mb-3">
                    <label className="block text-s mb-1">
                        {translations.forms?.enterEmail || "Please enter Email"}
                    </label>
                    <input 
                        type="email" 
                        className="form-input" 
                        placeholder="hello@reallygreatsite.com"
                    />
                </div>
                
                <div className="mb-3">
                    <label className="block text-s mb-1">
                        {translations.forms?.enterPassword || "Please enter password"}
                    </label>
                    <input 
                        type="password" 
                        className="form-input" 
                        placeholder="******"
                    />
                </div>
                
                <div className="mt-4">
                    <button className="text-red-600 text-sm font-bold">
                        {translations.profile?.deactivateAccount || "Deactivate Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}