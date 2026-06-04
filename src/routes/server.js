const express = require('express');
const path = require('path');
const notifyRoutes = require('./notify');
const subscribeRoutes = require('./subscribe');
const statusRoutes = require('./status');
const createServer = () => {
  const app = express();
  app.use(express.static(path.join(__dirname, '../../public')));
  app.use(express.json());
  app.use('/notify',notifyRoutes );
  app.use('/subscribe',subscribeRoutes);
  app.use('/notifications', statusRoutes);

  return app;
};

module.exports = { createServer };