import express from 'express';
import { getWalletBalance, depositMoney, transferMoney, withdrawMoney } from '../services/walletService.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/balance', authenticateToken, async (req, res) => {
    try {
        const balance = await getWalletBalance(req.user.userId);
        res.json(balance);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/deposit', authenticateToken, async (req, res) => {
    try {
        const { amount } = req.body;
        const response = await depositMoney(req.user.userId, amount);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/transfer', authenticateToken, async (req, res) => {
    try {
        const { recipientPhone, amount } = req.body;
        const response = await transferMoney(req.user.userId, recipientPhone, amount);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/withdraw', authenticateToken, async (req, res) => {
    try {
        const { amount, method, accountNumber } = req.body;
        const response = await withdrawMoney(req.user.userId, amount, method, accountNumber);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
