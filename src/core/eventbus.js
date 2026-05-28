const { EventEmitter } = require('events');
const emitter = new EventEmitter();
emitter.setMaxListeners(100);
const publish = (event, data) => {
  emitter.emit(event, { 
    ...data, 
    publishedAt: Date.now()
  });
};

const subscribe = (event, handler) => {
  emitter.on(event, handler);
  return () => emitter.removeListener(event, handler); 
};

const subscribeOnce = (event, handler) => {
  emitter.once(event, handler); 
};

module.exports = { 
  publish, 
  subscribe, 
  subscribeOnce 
};