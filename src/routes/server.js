const express = require('express');
const notifyRoutes = require('./notify');
const subscribeRoutes = require('./subscribe');
const statusRoutes = require('./status');
const createServer = () => {
  const app = express();
  app.use(express.json());  
  app.use('/notify',notifyRoutes );
  app.use('/subscribe',subscribeRoutes);
  app.use('/notifications', statusRoutes);

  return app;
};

module.exports = { createServer };