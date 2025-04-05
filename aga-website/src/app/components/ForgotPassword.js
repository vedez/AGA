"use client";

import { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import { useAuth } from "@/app/utils/AuthContext";
import { IoCloseCircleOutline } from "react-icons/io5";


export default function ForgotPassword({ onClose, onSuccess }) {
    const { translations } = useTranslation();
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!email) {
            setError(translations.forms?.emailRequired || "Email is required");
            return;
        }
        
        try {
            setError("");
            setLoading(true);
            
            await resetPassword(email);
            setSuccess(true);
            if (onSuccess) onSuccess();
            
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-center">
                        {translations.forms?.resetPassword || "Reset Password"}
                    </h2>
                    
                    <IoCloseCircleOutline onClick={onClose} className="text-gray-500 hover:text-gray-700" size={30} />
                </div>
                
                {success ? (
                    <div className="text-green-600 mb-4">
                        {translations.forms?.resetEmailSent || "If it’s associated with an account, you’ll receive a password reset link shortly."}
                    </div>
                ) : (
                    <>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        
                        <p className="mb-4">
                            {translations.forms?.resetInstructions || "Please enter your email address. If it’s associated with an account, you’ll receive a password reset link shortly."}
                        </p>
                        
                        <form className="form-container" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    {translations.forms?.email || "Email"}
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="abby@realsite.com"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="form-button"
                                    disabled={loading}
                                >
                                    {loading 
                                        ? (translations.forms?.sending || "Sending...") 
                                        : (translations.forms?.submit || "Submit")}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
} 