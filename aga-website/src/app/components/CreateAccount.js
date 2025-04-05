"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useTranslation from "@/hooks/useTranslation";
import { useAuth } from "@/app/utils/AuthContext";

export default function CreateAccount() {
    const { translations } = useTranslation();
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [dobError, setDobError] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { signup, updateUserProfile } = useAuth();
    const router = useRouter();
    

    async function handleSubmit(e) {
        e.preventDefault();
        
        try {
            setError("");
            setLoading(true);
            const userCredential = await signup(email, password);
            
            // create or update user profile with additional data
            await updateUserProfile({
                displayName: firstName,
                dob: dob ? new Date(dob).toISOString() : null
            });
              
            router.push("/main"); // redirect to home page after successful signup
        } catch (error) {
            let errorMessage = translations.forms?.errorSignup || "Failed to create an account.";
            
            // firebase error codes with more user-friendly messages
            if (error.code === "auth/weak-password") {
                errorMessage = translations.forms?.weakPassword || "Password must be at least 6 characters long.";
            } else if (error.code === "auth/email-already-in-use") {
                errorMessage = translations.forms?.emailInUse || "This email is already registered. Please use a different email or try logging in.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = translations.forms?.invalidEmail || "Please enter a valid email address.";
            } else {
                // other errors, append the error message
                errorMessage += " " + error.message;
            }
            
            setError(errorMessage);
            console.error("Signup error:", error);
        } finally {
            setLoading(false);
        }
    }

    const getMaxDate = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 13);
        return today.toISOString().split("T")[0];
      };
      
      const validateDob = (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 13);
      
        if (selectedDate > minDate) {
          setDobError("You must be 13 years or older to create an account.");
        } else {
          setDobError("");
        }
      };
    
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
                        {translations.forms?.enterDob || "Enter date of birth"}
                    </label>
                    <input
                        type="date"
                        id="dob"
                        className="form-input"
                        value={dob}
                        
                        onChange={(e) => {
                            const value = e.target.value;
                            setDob(value);
                            validateDob(value);
                        }}
                        max={getMaxDate()}

                        required
                    />

                    {dobError && (
                        <p className="text-sm text-red-500 mt-1 italic">{dobError}</p>
                    )}
                </div>
                
                <button 
                    type="submit" 
                    className="form-button"
                    disabled={loading}
                >
                    {loading ? (translations.forms?.loading || "Loading...") : (translations.forms?.signUp || "Submit")}
                </button>
            </form>
        </div>
    );
}