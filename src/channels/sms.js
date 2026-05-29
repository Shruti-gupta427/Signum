const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async ({ to, message }) => {
  const result = await client.messages.create({
    to,
    from: process.env.TWILIO_PHONE,
    body: message
  });
  console.log(`SMS sent to ${to} → ${result.sid}`);
  return { messageId: result.sid };
};

module.exports = { sendSMS };