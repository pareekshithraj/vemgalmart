import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Razorpay instance with mock/test keys if not present
// Replace these with actual Razorpay keys in Production
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_secret';

export const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});
