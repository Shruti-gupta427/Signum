const { queue } = require('../core/priorityQueue');
const { isAllowed } = require('../core/rateLimiter');
const { isOnline, sendToUser } = require('../core/connectionManager');
const { scheduleRetry } = require('./retry');
const { sendSMS } = require('../channels/sms');
const { sendEmail } = require('../channels/email');
const Notification = require('../models/notification');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const process = async (notification) => {
  const { userId, channel, message } = notification;

  if (!isAllowed(userId, channel)) {
    await Notification.findByIdAndUpdate(notification._id, {
      status: 'rate_limited'
    });
    return;
  }

  const saved = await Notification.create({
    ...notification,
    status: 'processing'
  });

  try {
    if (channel === 'ws' || channel === 'sse') {
      if (isOnline(userId)) {
        await sendToUser(userId, message);
        await Notification.findByIdAndUpdate(saved._id, {
          status: 'delivered',
          deliveredAt: new Date()
        });
      } else {
        await Notification.findByIdAndUpdate(saved._id, {
          status: 'pending'
        });
      }
    } else if (channel === 'sms') {
      await sendSMS({ to: notification.phone, message: message.body });
      await Notification.findByIdAndUpdate(saved._id, {
        status: 'delivered',
        deliveredAt: new Date()
      });
    } else if (channel === 'email') {
      await sendEmail({ to: notification.email, subject: message.subject, body: message.body });
      await Notification.findByIdAndUpdate(saved._id, {
        status: 'delivered',
        deliveredAt: new Date()
      });
    }
  } catch (err) {
    const retried = scheduleRetry(notification, err);
    if (!retried) {
      await Notification.findByIdAndUpdate(saved._id, {
        status: 'failed',
        error: err.message
      });
    }
  }
};

const startProcessor = async () => {
  console.log('Signum processor started');
  while (true) {
    if (!queue.isEmpty()) {
      const notification = queue.dequeue();
      await process(notification);
    } else {
      await sleep(100);
    }
  }
};

module.exports = { startProcessor };