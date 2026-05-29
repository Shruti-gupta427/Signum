const sendSMS = async ({ to, message }) => {
  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      authorization: process.env.FAST2SMS_KEY
    },
    body: JSON.stringify({
      route: 'q',
      message,
      language: 'english',
      flash: 0,
      numbers: to
    })
  });
  const data = await response.json();
  return { messageId: data.request_id };
};