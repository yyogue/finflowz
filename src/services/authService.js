import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendOTP } from '../utils/smsService.js';
import { findUserByPhone, createUser, updateUserVerificationCode } from '../models/userModel.js';

dotenv.config();

export const requestOTP = async (phone, username, password) => {
    let user = await findUserByPhone(phone);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = await createUser(phone, username, hashedPassword, otp);
    } else {
        await updateUserVerificationCode(phone, otp);
    }

    await sendOTP(phone, otp);
    return { message: 'OTP sent successfully' };
};

export const verifyOTP = async (phone, code) => {
    const user = await findUserByPhone(phone);
    if (!user || user.verification_code !== code) {
        throw new Error('Invalid OTP.');
    }

    await updateUserVerificationCode(phone, null);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return { token, username: user.username, balance: user.balance };
};
