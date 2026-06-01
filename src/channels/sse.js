const {add,remove} = require('../core/connectionManager');
const handleSSE = (req, res, userId) => {
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');

res.flushHeaders();
add(userId,res, {type: 'sse' });
res.write(': connected\n\n');
  // keep connection alive every 15s
const heartbeat = setInterval(() => {
  res.write(': ping\n\n');
}, 15000);
 // when user closes browser/tab
req.on('close', () => {
  clearInterval(heartbeat);
  remove(userId, res);
});

};

module.exports = { handleSSE };