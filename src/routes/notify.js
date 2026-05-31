const express = require('express');
const router = express.Router();
const { queue, PRIORITY } = require('../core/priorityQueue');
const Notification = require('../models/notification');

router.post('/', async (req, res) => {
  const { userId, channel, message, priority, phone, email } = req.body;
  const saved = await Notification.create({
    userId,
    channel,
    message,
    priority: priority ?? PRIORITY.MEDIUM,
    phone,
    email,
    status: 'queued'
  });
  queue.enqueue({ ...saved.toObject() });
  res.json({ queued: true, id: saved._id });
});

router.post('/broadcast', async (req, res) => {
  const { userIds, message, channel, priority } = req.body;
  for (const userId of userIds) {
    const saved = await Notification.create({
      userId,
      message,
      priority: priority ?? PRIORITY.MEDIUM,
      status: 'queued'
    });
    queue.enqueue(({ ...saved.toObject() }));
  }

  res.json({ queued: true, recipients: userIds.length });
});

module.exports = router;