// Notification Service for Email, SMS, and Push (FCM)
const admin = require('firebase-admin');

// Initialize Firebase Admin (Only if credentials exist)
try {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle newlines in private key
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
        });
        console.log('✅ Firebase Admin Initialized for Push Notifications');
    } else {
        console.warn('⚠️ Firebase Admin Credentials missing. Push notifications will be mocked.');
    }
} catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
}

export const sendPushNotification = async (fcmToken: string, title: string, body: string, data?: Record<string, string>) => {
    try {
        console.log(`\n================ PUSH NOTIFICATION (FCM) ================`);
        console.log(`To Token: ${fcmToken.slice(0, 20)}...`);
        console.log(`Title: ${title}`);
        console.log(`Body: ${body}`);
        console.log(`=========================================================\n`);

        if (admin.apps.length > 0) {
            const message = {
                notification: {
                    title,
                    body,
                },
                data: data || {}, // Optional silent data payload
                token: fcmToken,
            };

            const response = await admin.messaging().send(message);
            console.log('Successfully sent push message:', response);
            return true;
        } else {
            console.log('Firebase not configured. Simulating success.');
            return true;
        }
    } catch (error) {
        console.error('Failed to send Push Notification:', error);
        return false;
    }
};

export const sendSMS = async (phone: string, message: string) => {
    try {
        console.log(`\n================= SMS NOTIFICATION =================`);
        console.log(`To: ${phone}`);
        console.log(`Message: ${message}`);
        console.log(`======================================================\n`);
        return true;
    } catch (error) {
        console.error('Failed to send SMS:', error);
        return false;
    }
};

export const sendEmail = async (email: string, subject: string, message: string) => {
    try {
        console.log(`\n================ EMAIL NOTIFICATION ================`);
        console.log(`To: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);
        console.log(`======================================================\n`);
        return true;
    } catch (error) {
        console.error('Failed to send Email:', error);
        return false;
    }
};
