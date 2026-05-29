const sendSMS = async ({ to, message }) => {
  // TODO: plug in SMS provider
  console.log(`[SMS] → ${to}: ${message}`);
  return { messageId: `sms_${Date.now()}` };
};