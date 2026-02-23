// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import api from "./api"; // Our custom axios instance, or basic fetch

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForNow",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vemgal-mart.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vemgal-mart",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vemgal-mart.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:dummy"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
// Important: Messaging requires a browser environment, won't work in early Node testing
let messaging: any = null;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    messaging = getMessaging(app);
}

export const requestNotificationPermissionAndToken = async () => {
    try {
        if (!messaging) return null;

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            // Get the FCM token for this device
            // Note: You normally need a VAPID key here from your Firebase Console (Cloud Messaging settings)
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'dummy_vapid_key_placeholder'
            });

            if (token) {
                console.log("FCM Token retrieved successfully.");
                // Send this token to our backend to associate with the logged-in user
                try {
                    await api.post('/user/fcm-token', { fcmToken: token });
                    console.log("FCM Token registered with Vemgal Mart backend");
                } catch (e) {
                    console.error("Failed to register FCM token with backend", e);
                }
                return token;
            } else {
                console.log("No registration token available. Request permission to generate one.");
                return null;
            }
        } else {
            console.log("Notification permission denied.");
            return null;
        }
    } catch (error) {
        console.error("An error occurred while retrieving token:", error);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        if (!messaging) return;
        onMessage(messaging, (payload) => {
            console.log("Foreground Push Message Received: ", payload);
            resolve(payload);
        });
    });

export default app;
