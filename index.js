require('dotenv').config();
const { connect } = require('./src/db');

const start = async () => {

  await connect();
  console.log('connected');
};

start();