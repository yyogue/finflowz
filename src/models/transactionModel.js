import pool from '../config/db.js';

export const initializeTransactionTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            transaction_type VARCHAR(50) NOT NULL, -- deposit, transfer, withdrawal
            amount NUMERIC NOT NULL CHECK (amount > 0),
            recipient_id INT REFERENCES users(id) ON DELETE CASCADE, -- for transfers
            status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    await pool.query(query);
};

initializeTransactionTable().catch((err) => console.error('Error initializing transactions table:', err));

export const createTransaction = async (userId, transaction_type, amount, recipientId = null) => {
    const query = `
        INSERT INTO transactions (user_id, transaction_type, amount, recipient_id)
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [userId, transaction_type, amount, recipientId];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const getUserTransactions = async (userId) => {
    const query = `SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC;`;
    const { rows } = await pool.query(query, [userId]);
    return rows;
};

export const markTransactionCompleted = async (transactionId) => {
    const query = `
        UPDATE transactions
        SET status = 'completed'
        WHERE id = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [transactionId]);
    return rows[0];
};

