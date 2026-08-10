import express from 'express';
import { register, loginInitiate, verifyOTP, resendOTP } from '../controllers/authController.js';

const router = express.Router();
router.post('/register', register);
router.post('/login-initiate', loginInitiate);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

export default router;