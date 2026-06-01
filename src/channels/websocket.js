const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const { add, remove } = require('../core/connectionManager');
const Notification = require('../models/notification');
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return false;
  }
};

const initWebSocket=(server)=> {
  const wss = new WebSocketServer({ server, path:'/ws' });
  wss.on('connection', async (ws, req) => {
    const token = new URL(req.url, 'http://x')
      .searchParams.get('token');
    const user = verifyToken(token);
    if (!user) {
      ws.close(4001,'Unauthorized');
      return;
    }

    
    add(user.id, ws, { type: 'ws' });


const pending = await Notification.find({
  userId: user.id,
  status: 'pending'
});

for (const n of pending) {
  ws.send(JSON.stringify(n));
}

    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
    

  
    ws.on('close', () => {
      remove(user.id, ws);
    });
  });
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      ws.terminate();
      return;
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);
};

module.exports = { initWebSocket };