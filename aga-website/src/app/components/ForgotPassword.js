"use client";

import { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import { useAuth } from "@/app/utils/AuthContext";

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
                    <h2 className="text-xl font-semibold">
                        {translations.forms?.resetPassword || "Reset Password"}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>
                
                {success ? (
                    <div className="text-green-600 mb-4">
                        {translations.forms?.resetEmailSent || "Password reset email sent. Please check your inbox."}
                    </div>
                ) : (
                    <>
                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        
                        <p className="mb-4">
                            {translations.forms?.resetInstructions || "Enter your email address and we'll send you instructions to reset your password."}
                        </p>
                        
                        <form className="form-container" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    {translations.forms?.email || "Email"}
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="hello@reallygreatsite.com"
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
                                        : (translations.forms?.sendResetLink || "Send Reset Link")}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
} 