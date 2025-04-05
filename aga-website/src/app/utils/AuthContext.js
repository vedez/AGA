"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { 
    auth, 
    db,
    storage,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    sendPasswordResetEmail,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail,
    updateProfile
} from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

    async function signup(email, password) {
        if (!auth) {
            return Promise.reject(new Error("Firebase auth is not initialized"));
        }
        
        // Create the user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Automatically create a basic profile in Firestore
        if (db && userCredential.user) {
            try {
                const userDocRef = doc(db, "users", userCredential.user.uid);
                const defaultProfile = {
                    displayName: userCredential.user.displayName || "",
                    email: userCredential.user.email,
                    createdAt: new Date()
                };
                
                await setDoc(userDocRef, defaultProfile);
            } catch (err) {
                console.error("Error creating initial profile:", err);
            }
        }
        
        return userCredential;
    }

    async function login(email, password) {
        if (!auth) {
            console.error("Firebase auth is not initialized");
            return Promise.reject(new Error("Firebase auth is not initialized"));
        }
        return signInWithEmailAndPassword(auth, email, password);
    }

    async function logout() {
        if (!auth) {
            console.error("Firebase auth is not initialized");
            return Promise.reject(new Error("Firebase auth is not initialized"));
        }
        return signOut(auth);
    }

    async function resetPassword(email) {
        if (!auth) {
            console.error("Firebase auth is not initialized");
            return Promise.reject(new Error("Firebase auth is not initialized"));
        }
        return sendPasswordResetEmail(auth, email);
    }

    async function reauthenticate(password) {
        if (!auth.currentUser || !auth) {
            throw new Error("No user is logged in");
        }
        
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email, 
            password
        );
        
        return reauthenticateWithCredential(auth.currentUser, credential);
    }

    async function updateUserPassword(currentPassword, newPassword) {
        if (!auth.currentUser || !auth) {
            throw new Error("No user is logged in");
        }
        
        await reauthenticate(currentPassword);
        return updatePassword(auth.currentUser, newPassword);
    }

    async function updateUserProfile(data, password) {
        if (!auth.currentUser || !auth || !db) {
            throw new Error("No user is logged in or database not initialized");
        }
        
        
        // first reauthenticate
        if (password) {
            await reauthenticate(password);
        }
        
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        
        // update display name if provided
        if (data.displayName) {
            await updateProfile(auth.currentUser, {
                displayName: data.displayName
            });
        }
        
        // save user profile data to Firestore
        await setDoc(userDocRef, {
            ...data,
            updatedAt: new Date()
        }, { merge: true });
        
        // update local state
        if (userProfile) {
            const updatedProfile = {
                ...userProfile,
                ...data
            };
            setUserProfile(updatedProfile);
        } else {
            // fetch the user profile to ensure we have the latest data
            await fetchUserProfile();
        }
        
        return true;
    }

    async function uploadProfilePhoto(file) {
        if (!auth.currentUser || !storage) {
            throw new Error("No user is logged in or storage not initialized");
        }
        
        // create storage reference
        const storageRef = ref(storage, `profilePhotos/${auth.currentUser.uid}`);
        
        // upload file
        await uploadBytes(storageRef, file);
        
        // get download URL
        const photoURL = await getDownloadURL(storageRef);
        
        // update user profile
        await updateProfile(auth.currentUser, {
            photoURL
        });
        
        // update in Firestore
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, {
            photoURL,
            updatedAt: new Date()
        }, { merge: true });
        
        // update local state
        if (userProfile) {
            setUserProfile({
                ...userProfile,
                photoURL
            });
        }
        
        return photoURL;
    }

    async function fetchUserProfile() {
        if (!auth.currentUser || !db) {
            console.error("No user is logged in or database not initialized");
            return null;
        }
        
        
        try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(userDocRef);
            
            if (docSnap.exists()) {
                const profile = docSnap.data();
                setUserProfile(profile);
                return profile;
            } else {
                // create an empty profile if none exists
                const defaultProfile = {
                    displayName: auth.currentUser.displayName || "",
                    email: auth.currentUser.email,
                    photoURL: auth.currentUser.photoURL,
                    createdAt: new Date()
                };
                
                await setDoc(userDocRef, defaultProfile);
                setUserProfile(defaultProfile);
                return defaultProfile;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            return null;
        }
    }

    useEffect(() => {
        let unsubscribe = () => {};
        
        if (auth) {
            unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setLoading(false);
                
                if (user) {
                    fetchUserProfile();
                } else {
                    setUserProfile(null);
                }
            });
        } else {
            console.error("Firebase auth is not initialized");
            setLoading(false);
        }

        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        logout,
        resetPassword,
        updateUserPassword,
        updateUserProfile,
        uploadProfilePhoto,
        fetchUserProfile,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
    );
} 