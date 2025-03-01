import { updateUserBankAccount, updateUserCard } from '../models/userModel.js';

export const linkBankAccount = async (userId, bankAccountDetails) => {
    return await updateUserBankAccount(userId, bankAccountDetails);
};

export const linkCard = async (userId, cardDetails) => {
    return await updateUserCard(userId, cardDetails);
};
