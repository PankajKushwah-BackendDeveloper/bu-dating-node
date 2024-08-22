import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIOSID;
const authToken = process.env.TWILIOTOKEN;

if (!accountSid || !authToken) {
  throw new Error('Twilio account SID and Auth Token must be defined in environment variables');
}


const client = twilio(accountSid, authToken);

export const sendOtpUsingTwilio = async (to, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: '+447380990064', 
      to: to
    });
    console.log('Message:', message);
    console.log(`OTP sent successfully: ${message.sid}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
