const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
const sendEmail = async ({ to, subject, body }) => {
  const result = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text: body
  });
  console.log(`Email sent to ${to} → ${result.messageId}`);
  return { messageId: result.messageId };
};
module.exports = { sendEmail };