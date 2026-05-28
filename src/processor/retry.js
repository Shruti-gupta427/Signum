
const { queue } = require('../core/priorityQueue');
const scheduleRetry = (notification, err) => {
  const attempts = (notification.attempts || 0) + 1;
  if (attempts >= notification.maxAttempts) {
    return false;  // give up
  }

  const delay = Math.pow(2, attempts) * 1000;

  setTimeout(() => {
    queue.enqueue({ 
      ...notification, 
      attempts 
    });
  }, delay);

  return true;  
};

module.exports = { scheduleRetry };