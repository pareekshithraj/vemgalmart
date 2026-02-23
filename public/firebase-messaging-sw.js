// Scripts for Firebase Cloud Messaging in the background
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDummyKeyForNow",
    authDomain: "vemgal-mart.firebaseapp.com",
    projectId: "vemgal-mart",
    storageBucket: "vemgal-mart.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:dummy"
};

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/vite.svg',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
