const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

exports.sendMessage = async (userNumber, message) => {
    try {
        await client.messages.create({
            body: message,
            to: `+${userNumber}`,
            // from: 'twilioNumber',
            messagingServiceSid: 'MGd801736439c0f5242b2f7153e39f80a0',
        });
    } catch (err) {
        // console.log(err.message);
        return err.message;
    }
};
