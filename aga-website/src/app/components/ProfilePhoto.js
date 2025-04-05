"use client";

import { useState, useRef } from "react";
import useTranslation from "@/hooks/useTranslation";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/app/utils/AuthContext";

export default function ProfilePhoto() {
    const { translations } = useTranslation();
    const { userProfile, uploadProfilePhoto } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const handleFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // check file type
        if (!file.type.startsWith('image/')) {
            setError(translations.profile?.invalidFileType || "Please select an image file");
            return;
        }
        
        // check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError(translations.profile?.fileTooLarge || "File size should be less than 5MB");
            return;
        }
        
        try {
            setUploading(true);
            setError("");
            await uploadProfilePhoto(file);
        } catch (error) {
            console.error("Error uploading photo:", error);
            setError(translations.profile?.uploadError || "Failed to upload photo. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return(
        <div className="flex flex-col items-center w-full sm:w-auto">
            <div className="rounded-full flex items-center justify-center mb-4 w-[150px] h-[150px] overflow-hidden bg-gray-200 border-2 border-gray-800" >
                {userProfile?.photoURL ? (
                    <img 
                        src={userProfile.photoURL} 
                        alt="Profile" 
                        className="w-full h-full"
                    />
                ) : (
                    <FaUserCircle size={150} className="text-gray-700" />
                )}
            </div>
            
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            
            <button 
                onClick={handleFileSelect}
                disabled={uploading}
                className="main-button text-base py-2.5 px-5"
            >
                {uploading 
                    ? (translations.forms?.loading || "Loading...")
                    : (translations.profile?.changePhoto || "Change Photo")}
            </button>
        </div>
    );
}