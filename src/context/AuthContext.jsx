import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
    onAuthStateChanged,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        let isActive = true;
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!isActive) return;
            setLoading(true);
            setUser(currentUser);

            if (!currentUser) {
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const adminSnap = await getDoc(doc(db, 'admins', currentUser.uid));
                if (isActive) {
                    setIsAdmin(adminSnap.exists());
                }
            } catch (error) {
                console.error('Failed to check admin status:', error);
                if (isActive) {
                    setIsAdmin(false);
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        });

        return () => {
            isActive = false;
            unsubscribe();
        };
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => firebaseSignOut(auth);

    const value = {
        user,
        loading,
        login,
        logout,
        isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
