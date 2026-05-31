
const PRIORITY = {
  CRITICAL : 0,  
  HIGH     : 1,   
  MEDIUM   : 2,   
  LOW      : 3   
};
const buckets = {
  0: [],  
  1: [],   
  2: [],   
  3: []    
};
let queuesize=0;
const enqueue = (notification) => {
  const p = notification.priority ?? PRIORITY.MEDIUM;

  buckets[p].push({
    ...notification,
    enqueuedAt: Date.now()
  });

  queuesize++;
};

const dequeue = () => {
  for (let p = 0; p <= 3; p++) {
    if (buckets[p].length> 0) {  
      queuesize--;
      return buckets[p].shift(); // remove and return first
    }
  }
  return null; // nothing found
};

const isEmpty = () => queuesize === 0;

const getSize=()=>{
    return queuesize;
}

const queue = { enqueue, dequeue, isEmpty, getSize };

module.exports = { queue, PRIORITY };
