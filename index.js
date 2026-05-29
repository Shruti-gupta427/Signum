require('dotenv').config();
const { connect } = require('./src/db');
const { sendEmail } = require('./src/channels/email');

const start = async () => {
  await connect();

  const result = await sendEmail({
    to: 'bcs_2024068@iiitm.ac.in',
    subject: 'Signum Test Email',
    body: 'Signal everything, miss nothing.'
  });

  console.log(result);
};

start();