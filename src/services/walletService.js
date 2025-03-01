import pool from '../config/db.js';
import { createTransaction } from '../models/transactionModel.js';
import { findUserById, findUserByPhone, updateUserBalance } from '../models/userModel.js';

/**
 * Get user's wallet balance.
 */
export const getWalletBalance = async (userId) => {
    const user = await findUserById(userId);
    if (!user) throw new Error(`User not found for ID: ${userId}`);
    return { balance: user.balance };
};


export const markTransactionCompleted = async (transactionId) => {
    const query = `
        UPDATE transactions
        SET status = 'completed'
        WHERE id = $1 RETURNING *;
    `;
    const { rows } = await pool.query(query, [transactionId]);
    return rows[0];
};


/**
 * Deposit money into the wallet.
 */
export const depositMoney = async (userId, amount) => {
  if (amount <= 0) throw new Error('Deposit amount must be greater than zero.');

  await updateUserBalance(userId, amount);
  const transaction = await createTransaction(userId, 'deposit', amount);

  // Mark transaction as completed after 5 seconds
  setTimeout(() => {
      markTransactionCompleted(transaction.id);
      console.log(`✅ Deposit transaction ${transaction.id} marked as completed.`);
  }, 5000);

  return { message: 'Deposit successful', transaction };
};

/**
 * Transfer money to another user.
 */

export const transferMoney = async (senderId, recipientPhone, amount) => {
  if (amount <= 0) throw new Error('Transfer amount must be greater than zero.');

  const sender = await findUserById(senderId);
  const recipient = await findUserByPhone(recipientPhone);

  if (!recipient) throw new Error('Recipient not found.');
  if (sender.phone === recipient.phone) throw new Error('You cannot send money to yourself.');
  if (sender.balance < amount) throw new Error('Insufficient balance.');

  await updateUserBalance(senderId, -amount);
  await updateUserBalance(recipient.id, amount);

  const transaction = await createTransaction(senderId, 'transfer', amount, recipient.id);

  setTimeout(() => {
      markTransactionCompleted(transaction.id);
      console.log(`✅ Transfer transaction ${transaction.id} marked as completed.`);
  }, 5000);

  return { message: 'Transfer successful', transaction };
};

/**
 * Withdraw money from the wallet.
 */

export const withdrawMoney = async (userId, amount, method, accountNumber) => {
  const user = await findUserById(userId);
  if (!user) throw new Error('User not found');
  if (user.balance < amount) throw new Error('Insufficient balance');

  await updateUserBalance(userId, -amount);
  const withdrawal = await createTransaction(userId, 'withdraw', amount, null, method, accountNumber);

  setTimeout(async () => {
      // Simulate a failure scenario
      const isSuccessful = Math.random() > 0.2; // 80% success rate
      if (isSuccessful) {
          await markTransactionCompleted(withdrawal.id);
          console.log(`✅ Withdrawal transaction ${withdrawal.id} marked as completed.`);
      } else {
          await reverseTransaction(withdrawal.id, userId, amount);
      }
  }, 5000);

  return { message: 'Withdrawal request submitted', withdrawal };
};

/**
 * Send money using different funding sources (wallet, bank, card).
 */
export const sendMoney = async (userId, recipientPhone, amount, fundingSource) => {
    const sender = await findUserById(userId);
    if (!sender) throw new Error('Sender not found');

    const recipient = await findUserByPhone(recipientPhone);
    if (!recipient) throw new Error('Recipient not found');

    if (fundingSource === 'wallet' && sender.balance < amount) throw new Error('Insufficient balance');

    // Deduct from funding source
    if (fundingSource === 'wallet') {
        await updateUserBalance(userId, -amount);
    } else if (fundingSource === 'bank' || fundingSource === 'card') {
        console.log(`✅ Processing payment from ${fundingSource}`);
    }

    // Add money to recipient's wallet
    await updateUserBalance(recipient.id, amount);

    const transaction = await createTransaction(userId, 'send_money', amount, recipient.id, fundingSource);

    return { message: 'Transfer successful', transaction };
};

export const reverseTransaction = async (transactionId, userId, amount) => {
  await updateUserBalance(userId, amount);

  const query = `
      UPDATE transactions
      SET status = 'failed'
      WHERE id = $1
      RETURNING *;
  `;
  const { rows } = await pool.query(query, [transactionId]);
  console.log(`❌ Transaction ${transactionId} reversed.`);
  return rows[0];
};

