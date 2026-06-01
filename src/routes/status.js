const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification
      .find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:userId/unread', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.params.userId,
      status: 'pending'
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { status: 'read', readAt: new Date() }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router