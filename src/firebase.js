import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADfb6QNAD2oOcioweTRexcfoCxyjPq6_s",
    authDomain: "ghasblog-8099b.firebaseapp.com",
    projectId: "ghasblog-8099b",
    storageBucket: "ghasblog-8099b.firebasestorage.app",
    messagingSenderId: "965801686573",
    appId: "1:965801686573:web:e05a4c93020caed2586aa4",
    measurementId: "G-MD7XYGYWR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
