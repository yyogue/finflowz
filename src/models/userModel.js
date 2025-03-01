
import pool from '../config/db.js';


const initializeUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(15) UNIQUE NOT NULL,
      username VARCHAR(50) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      verification_code VARCHAR(6),
      balance NUMERIC DEFAULT 0,
      linked_bank_account TEXT,  -- Stores bank account details
      linked_card TEXT,  -- Stores encrypted card details
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
};

initializeUserTable().catch((err) => console.error('Error initializing users table:', err));


export const createUser = async (phone, username, password, verificationCode) => {
  const query = `
    INSERT INTO users (phone, username, password, verification_code)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const values = [phone, username, password, verificationCode];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findUserByPhone = async (phone) => {
  console.log("🔍 Searching for user with phone:", phone); // ✅ Debugging line

  const query = 'SELECT * FROM users WHERE phone = $1;';
  const { rows } = await pool.query(query, [phone]);

  if (rows.length === 0) {
      console.log("❌ User not found for phone:", phone);
      return null;
  }

  console.log("✅ User found:", rows[0]); // ✅ Log the found user
  return rows[0];
};


export const findUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1;';
  const { rows } = await pool.query(query, [username]);
  return rows[0];
};

export const updateUserVerificationCode = async (phone, code) => {
  const query = 'UPDATE users SET verification_code = $1 WHERE phone = $2 RETURNING *;';
  const { rows } = await pool.query(query, [code, phone]);
  return rows[0];
};

export const updateUserBalance = async (userId, amount) => {
  const query = 'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *;';
  const { rows } = await pool.query(query, [amount, userId]);
  return rows[0];
};

export const findUserById = async (userId) => {
  const query = 'SELECT * FROM users WHERE id = $1;';
  const { rows } = await pool.query(query, [userId]);

  if (rows.length === 0) {
      console.log("❌ User not found for ID:", userId);
      return null;
  }

  console.log("✅ User found:", rows[0]);
  return rows[0];
};

export const updateUserBankAccount = async (userId, bankAccountDetails) => {
  const query = 'UPDATE users SET linked_bank_account = $1 WHERE id = $2 RETURNING *;';
  const { rows } = await pool.query(query, [bankAccountDetails, userId]);

  if (rows.length === 0) {
      throw new Error("User not found during bank account update");
  }

  return rows[0];
};

// Function to update user's linked card details
export const updateUserCard = async (userId, cardDetails) => {
  const query = 'UPDATE users SET linked_card = $1 WHERE id = $2 RETURNING *;';
  const { rows } = await pool.query(query, [cardDetails, userId]);

  if (rows.length === 0) {
      throw new Error("User not found during card update");
  }

  return rows[0];
};
