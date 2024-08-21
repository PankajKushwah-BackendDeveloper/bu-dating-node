import twilio from 'twilio';
import env from 'dotenv'

env.config();



const accountSid = process.env.TWILIOSID;
const authToken = process.env.TWILIOTOKEN;
const client = twilio(accountSid, authToken);

export const sendOtpUsingTwilio = async (to, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: 'YOUR_TWILIO_PHONE_NUMBER',
      to: to
    });
    console.log('message: ', message);

    console.log(`OTP sent successfully: ${message.sid}`);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};


