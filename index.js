require('dotenv').config();
const http = require('http');
const { connect } = require('./src/db');
const { createServer } = require('./src/routes/server');
const { initWebSocket } = require('./src/channels/websocket');
const { startProcessor } = require('./src/processor/index');
const start = async () => {
  await connect();
  const app = createServer();
  const server = http.createServer(app);
  initWebSocket(server);
  startProcessor();
  server.listen(process.env.PORT, () => {
    console.log(`Signum running on port ${process.env.PORT}`);
  });
};

start();