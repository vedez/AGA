"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useTranslation from "@/hooks/useTranslation";
import { useAuth } from "@/app/utils/AuthContext";

export default function CreateAccount() {
    const { language, setLanguage, translations } = useTranslation();
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            setError("");
            setLoading(true);
            const userCredential = await signup(email, password);
            
            // Here you could store additional user data in Firestore if needed
            // For example: name, date of birth, etc.
            
            router.push("/"); // Redirect to home page after successful signup
        } catch (error) {
            setError((translations.forms?.errorSignup || "Failed to create an account.") + " " + error.message);
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="w-full">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                        {translations.forms?.enterFirstName || "Please enter your first name"}
                    </label>
                    <input 
                        type="text" 
                        id="firstName" 
                        placeholder="Jiara Martins" 
                        className="form-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        {translations.forms?.enterEmail || "Please enter Email"}
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
                        {translations.forms?.enterPassword || "Please enter password"}
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
                
                <div className="form-group">
                    <label htmlFor="dob" className="form-label">
                        {translations.forms?.enterDob || "Please enter date of birth"}
                    </label>
                    <input 
                        type="text" 
                        id="dob" 
                        placeholder="Month and Year" 
                        className="form-input"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="form-button"
                    disabled={loading}
                >
                    {loading ? (translations.forms?.loading || "Loading...") : (translations.forms?.signUp || "SIGN UP")}
                </button>
            </form>
        </div>
    );
}