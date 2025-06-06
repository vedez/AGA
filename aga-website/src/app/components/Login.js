"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useTranslation from "@/hooks/useTranslation";
import { useAuth } from "@/app/utils/AuthContext";
import ForgotPassword from "@/app/components/ForgotPassword";

export default function Login() {
    const { translations } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            setError("");
            setLoading(true);
            await login(email, password);
            router.push("/main"); // redirect to landing page after successful login

        } catch (error) {
            setError(translations.forms?.errorLogin || "Failed to sign in. Please check your credentials.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleForgotPasswordSuccess = () => {
        setTimeout(() => {
            setShowForgotPassword(false);
        }, 3000); // close the modal after 3 seconds
    };

    return(
        <div className="w-full">
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        {translations.forms?.enterEmail || "Enter Email"}
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
                
                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        {translations.forms?.enterPassword || "Enter password"}
                    </label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="********" 
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div className="flex justify-end">
                    <button 
                        type="button" 
                        onClick={() => setShowForgotPassword(true)}
                        className="form-link text-left bg-transparent border-none cursor-pointer  text-green-600 hover:text-green-700"
                    >
                        {translations.forms?.forgotPassword || "Forgot Password?"}
                    </button>
                </div>
                
                <button 
                    type="submit" 
                    className="form-button"
                    disabled={loading}
                >
                    {loading ? (translations.forms?.loading || "Loading...") : (translations.forms?.signIn || "SIGN IN")}
                </button>
            </form>

            {showForgotPassword && (
                <ForgotPassword 
                    onClose={() => setShowForgotPassword(false)}
                    onSuccess={handleForgotPasswordSuccess}
                />
            )}
        </div>
    );
}