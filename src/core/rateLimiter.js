const limit = {
  sms: { capacity: 5,   refillRate: 0.1 },  
  email: { capacity: 10,  refillRate: 0.5 }, 
  ws: { capacity: 100, refillRate: 10  },  
  sse:{ capacity: 100, refillRate: 10  } 
}
const buckets = new Map();

const getBucket = (userId, channel) => {
   const key = userId + ":" + channel;
  if (!buckets.has(key)) {
    const { capacity, refillRate } = limit[channel] || { capacity: 10, refillRate: 1 };
    
    buckets.set(key, {
      tokens: capacity,      
      capacity: capacity,
      refillRate:refillRate,
      lastRefill: Date.now() 
    });
  }
  return buckets.get(key);
};

const refill=(bucket) =>{
    const now = Date.now();
    const timeelapsed = (now -bucket.lastRefill)/1000.0;
    bucket.tokens = Math.min(
    bucket.capacity,
    bucket.tokens + timeelapsed * bucket.refillRate
  );

  bucket.lastRefill = now;

}
const isAllowed=(userId, channel) =>{
    const bucket =getBucket(userId,channel);
    refill(bucket);
    if(bucket.tokens>=1){
        bucket.tokens--;
        return true;
    }
    return false;
}
module.exports = { isAllowed };
