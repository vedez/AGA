"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import useTranslation from "@/hooks/useTranslation";
import { useAuth } from "@/app/utils/AuthContext";
import { reauthenticate, deleteUser, EmailAuthProvider } from "firebase/auth";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function AccountSetting() {
    const { translations } = useTranslation();
    const { currentUser, userProfile, updateUserProfile, updateUserPassword, fetchUserProfile, reauthenticate } = useAuth();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPasswordVerification, setShowPasswordVerification] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [modalError, setModalError] = useState("");

    
    // form fields to update
    const [formUpdates, setFormUpdates] = useState({});
    
    // add a new state for deactivation modal
    const [showDeactivateVerification, setShowDeactivateVerification] = useState(false);
    const [deactivateError, setDeactivateError] = useState("");

    useEffect(() => {    
        // fetch user profile data when component mounts
        if (currentUser && (!userProfile || Object.keys(userProfile).length === 0)) {
            fetchUserProfile();
        }
        
        if (userProfile) {
            setName(userProfile.displayName || "");
            setEmail(currentUser?.email || "");
        }          
    }, [userProfile, currentUser, fetchUserProfile]);
    
    const handleSaveChanges = (e) => {
        e.preventDefault();
        
        setError("");
        setSuccess("");
        
        // validate inputs
        if (newPassword && newPassword !== confirmNewPassword) {
            setError(translations.forms?.passwordMismatch || "New passwords do not match");
            return;
        }
        
        if (newPassword && newPassword.length < 6) {
            setError(translations.forms?.passwordTooShort || "Password must be at least 6 characters");
            return;
        }
        
        // store changes for later update after password verification
        const updates = {};
        
        if (name !== userProfile?.displayName) {
            updates.displayName = name;
        }
        
        if (Object.keys(updates).length > 0 || newPassword) {
            setFormUpdates(updates);
            setShowPasswordVerification(true);
        } else {
            setSuccess(translations.profile?.noChanges || "No changes to save");
        }
    };
    
    const handleVerifyAndUpdate = async (e) => {
        e.preventDefault();
      
        setModalError(""); 
        setError("");      
        setSuccess("");  
      
        if (!currentPassword) {
          setModalError(translations.forms?.passwordRequired || "Please enter your current password");
          return;
        }
      
        try {
          setLoading(true);
          console.log("Starting profile update with:", formUpdates);
      
          if (Object.keys(formUpdates).length > 0) {
            await updateUserProfile(formUpdates, currentPassword);
            console.log("Profile updated successfully");
          }
      
          if (newPassword) {
            await updateUserPassword(currentPassword, newPassword);
            console.log("Password updated successfully");
          }
      
          // on success
          setShowPasswordVerification(false);
          setFormUpdates({});
          setNewPassword("");
          setConfirmNewPassword("");
          setCurrentPassword("");
          setSuccess(translations.profile?.updateSuccess || "Profile updated successfully");
      
          // fetch fresh user data after update
          await fetchUserProfile();
      
        } catch (error) {
          console.error("Update error:", error);
      
          if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
            setModalError(translations.forms?.wrongPassword || "You entered an incorrect password");
          } else if (error.code === "auth/too-many-requests") {
            setModalError(translations.forms?.tooManyAttempts || "Too many attempts. Try again later.");
          } else {
            setModalError((translations.forms?.updateFailed || "Failed to update profile: ") + error.message);
          }
          
        } finally {
          setLoading(false);
        }
    };
    
    const closeVerification = () => {
        setShowPasswordVerification(false);
        setCurrentPassword("");
        setFormUpdates({});
    };

    const handleDeactivateRequest = () => {
        setDeactivateError("");
        setCurrentPassword("");
        setShowDeactivateVerification(true);
    };

    const handleDeactivate = async (e) => {
        e.preventDefault();
        
        if (!currentPassword) {
            setDeactivateError(translations.forms?.passwordRequired || "Please enter your password to continue");
            return;
        }

        try {
            setLoading(true);
            setDeactivateError("");
            
            // first reauthenticate with the user's password
            await reauthenticate(currentPassword);
            
            // then delete the account
            await deleteUser(currentUser);
            setShowDeactivateVerification(false);
            alert(translations.profile?.accountDeactivated || "Account deactivated. You will be signed out.");
        } catch (err) {
            console.error("Deactivation error:", err);
            
            if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                setDeactivateError(translations.forms?.wrongPassword || "You entered an incorrect password");
            } else if (err.code === "auth/too-many-requests") {
                setDeactivateError(translations.forms?.tooManyAttempts || "Too many attempts. Try again later.");
            } else {
                setDeactivateError((translations.forms?.deactivationFailed || "Failed to deactivate account: ") + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const closeDeactivateVerification = () => {
        setShowDeactivateVerification(false);
        setCurrentPassword("");
        setDeactivateError("");
    };

    return(
        <div className="w-full mx-auto max-w-lg m-5">
            <div className="flex justify-center sm:justify-end mb-4">
                <button 
                    className="main-button rounded text-m"
                    onClick={handleSaveChanges}
                    disabled={loading}
                >
                    {loading 
                        ? (translations.forms?.saving || "Saving...") 
                        : (translations.profile?.saveChanges || "Save Changes")}
                </button>
            </div>
            
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-600 mb-4">{success}</div>}
            
            <div className="clear-both space-y-5">
                <div className="mb-3">
                    <label className="form-label">
                        {translations.forms?.enterName || "Please enter your name"}
                    </label>
                    <input 
                        type="text" 
                        className="form-input" 
                        placeholder={translations.forms?.yourName || "Your Name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        {translations.forms?.newPassword || "New Password"}
                    </label>
                    <input 
                        type="password" 
                        className="form-input" 
                        placeholder={translations.forms?.leaveBlankPassword || "Leave blank to keep current password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                
                {newPassword && (
                    <div className="mb-3">
                        <label className="form-label">
                            {translations.forms?.confirmPassword || "Confirm New Password"}
                        </label>
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder={translations.forms?.confirmNewPassword || "Confirm new password"}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                    </div>
                )}
                
                <div className="mb-3">
                    <label className="form-label">
                        {translations.forms?.enterDob || "Date of birth"}
                    </label>
                    <input 
                        type="text" 
                        className="form-input bg-gray-300 text-gray-500" 
                        placeholder={translations.forms?.notSpecified || "Not specified"}
                        value={userProfile?.dob ? format(new Date(userProfile.dob), "MMMM d, yyyy") : ""}
                        readOnly
                    />
                </div>
                
                <div className="mb-3">
                    <label className="form-label text-gray-500">
                        {translations.forms?.enterEmail || "Email"}
                    </label>
                    <input 
                        type="email" 
                        className="form-input bg-gray-300 text-gray-500" 
                        placeholder={email || translations.forms?.notSpecified || "Not specified"}
                        value={email}
                        readOnly
                    />
                </div>
                        
                <div className="mt-4">
                    <button className="text-red-600 text-sm font-bold" onClick={handleDeactivateRequest}>
                        {translations.profile?.deactivateAccount || "Deactivate Account"}
                    </button>
                </div>
            </div>
            
            {showPasswordVerification && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="verify-password-title"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 id="verify-password-title" className="text-xl font-semibold">
                        {translations.forms?.verifyPassword || "Verify Password"}
                        </h2>
                        <IoCloseCircleOutline
                        onClick={closeVerification}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        size={24}
                        />
                    </div>

                    <p className="mb-4">
                        {translations.forms?.passwordVerificationMessage ||
                        "Please enter your current password to save these changes"}
                    </p>

                    {modalError && (
                        <div className="text-red-500 mb-4 text-sm text-center">
                        {modalError}
                        </div>
                    )}

                    <form onSubmit={handleVerifyAndUpdate}>
                        <div className="form-group">
                        <label htmlFor="current-password" className="form-label">
                            {translations.forms?.currentPassword || "Current Password"}
                        </label>
                        <input
                            type="password"
                            id="current-password"
                            className="form-input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
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
                            ? (translations.forms?.verifying || "Verifying...")
                            : (translations.forms?.confirm || "Confirm")}
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            )}

            {showDeactivateVerification && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="deactivate-verification-title"
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 id="deactivate-verification-title" className="text-xl font-semibold">
                        {translations.forms?.deactivateVerificationTitle || "Deactivate Account Verification"}
                        </h2>
                        <IoCloseCircleOutline
                        onClick={closeDeactivateVerification}
                        className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        size={24}
                        />
                    </div>

                    <p className="mb-4">
                        {translations.forms?.deactivateVerificationMessage ||
                        "Please enter your password to confirm account deactivation. This action cannot be undone."}
                    </p>

                    {deactivateError && (
                        <div className="text-red-500 mb-4 text-sm text-center">
                        {deactivateError}
                        </div>
                    )}

                    <form onSubmit={handleDeactivate}>
                        <div className="form-group">
                        <label htmlFor="deactivate-password" className="form-label">
                            {translations.forms?.password || "Password"}
                        </label>
                        <input
                            type="password"
                            id="deactivate-password"
                            className="form-input"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        </div>

                        <div className="flex justify-end">
                        <button
                            type="submit"
                            className="form-button bg-red-600 hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading
                            ? (translations.forms?.deactivating || "Deactivating...")
                            : (translations.forms?.confirmDeactivation || "Confirm Deactivation")}
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            )}
        </div>
    );
}