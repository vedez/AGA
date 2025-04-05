"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from './firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password) {
        if (!auth) {
            console.error("Firebase auth is not initialized");
            return Promise.reject(new Error("Firebase auth is not initialized"));
        }
        return createUserWithEmailAndPassword(auth, email, password);
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

    useEffect(() => {
        let unsubscribe = () => {};
        
        if (auth) {
            unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setLoading(false);
            });
        } else {
            console.error("Firebase auth is not initialized");
            setLoading(false);
        }

        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
    );
} 