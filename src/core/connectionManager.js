const connections =new Map();
const meta = new WeakMap();

const add = (userId,conn, info ={})=> {
if(!connections.has(userId)){
    connections.set(userId, new Set());
}
connections.get(userId).add(conn);
  meta.set(conn, {
    userId,
    type: info.type || 'ws',
    deviceId: info.deviceId,
    connectedAt: Date.now ()
  });
};
const remove = (userId, conn) => {
  const setofconn  =connections.get(userId)
  if (!setofconn) return;
  if (setofconn.has(conn)){
    setofconn.delete(conn);
  }
  if(setofconn.size===0){
    connections.delete(userId);
  }
};

const getConnections = (userId) => {
  return connections.get(userId) || new Set();
};
const isOnline =(userId) =>{
    return connections.get(userId) && connections.get(userId).size>0
       
}

const getMeta =(conn) =>{
    return meta.get(conn);
}

const totalConnections = () =>{
    let count =0;
    for (const key of connections.keys()) {
     count += connections.get(key).size;
}
return count;
}

const sendToUser = async (userId, message) => {
  const userConns = getConnections(userId);
  const results = [];

  for (const conn of userConns) {
    const info = getMeta(conn);
    try {
      if (info.type === 'ws') {
          conn.send(JSON.stringify(message))
      } else if (info.type === 'sse') {
         conn.write(`data: ${JSON.stringify(message)}\n\n`)
      }
      results.push({ delivered: true });
    } catch (err) {
      remove(userId, conn);
      results.push({ delivered: false });
    }
  }
  return results;
};
module.exports = {
  add,
  remove,
  getConnections,
  isOnline,
  getMeta,
  sendToUser,
  totalConnections
};