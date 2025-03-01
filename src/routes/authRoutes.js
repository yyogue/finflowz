import express from 'express';
import { requestOTP, verifyOTP } from '../services/authService.js';

const router = express.Router();

// Request OTP
router.post('/request-otp', async (req, res) => {
    try {
        const { phone, username, password } = req.body;
        const response = await requestOTP(phone, username, password);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Verify OTP and Login
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, code } = req.body;
        const response = await verifyOTP(phone, code);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
