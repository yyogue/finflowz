import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages.create({
    body: "Test OTP from FinFlowz",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+19547165510"
}).then(msg => console.log("✅ Message sent:", msg.sid))
  .catch(err => console.error("❌ Twilio Error:", err));
