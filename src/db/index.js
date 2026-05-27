const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Signum connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

const disconnect = async () => {
  await mongoose.disconnect();
  console.log('Signum disconnected from MongoDB');
};

module.exports = { connect, disconnect };