import express from 'express';
import { linkBankAccount, linkCard } from '../services/userService.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/link-bank', authenticateToken, async (req, res) => {
    try {
        const { bankAccountDetails } = req.body;
        const response = await linkBankAccount(req.user.userId, bankAccountDetails);
        res.json({ message: 'Bank account linked successfully', response });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/link-card', authenticateToken, async (req, res) => {
    try {
        const { cardDetails } = req.body;
        const response = await linkCard(req.user.userId, cardDetails);
        res.json({ message: 'Card linked successfully', response });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
