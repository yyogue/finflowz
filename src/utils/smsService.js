import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOTP = async (phone, otp) => {
    try {
        console.log(`📨 Sending OTP to ${phone} from ${process.env.TWILIO_PHONE_NUMBER}`);
        const message = await client.messages.create({
            body: `Your FinFlowz verification code is: ${otp}. Do not share this code.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });
        console.log(`✅ OTP Sent: Message SID ${message.sid}`);
        return message.sid;
    } catch (error) {
        console.error("❌ Twilio Error:", error);
        throw new Error(`Failed to send OTP. Reason: ${error.message}`);
    }
};
