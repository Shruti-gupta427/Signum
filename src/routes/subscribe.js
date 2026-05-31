const express = require('express');
const router = express.Router();
const { handleSSE } = require('../channels/sse');

router.get('/sse', (req, res) => {
  const userId = req.query.userId;
  handleSSE(req, res, userId);
});

module.exports = router;