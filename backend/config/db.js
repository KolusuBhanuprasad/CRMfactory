const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.USE_MOCK_DB === 'true') {
    console.log('----------------------------------------------------');
    console.log('ℹ️  USE_MOCK_DB is set to true.');
    console.log('⚠️  RUNNING IN IN-MEMORY MOCK MODE (NO DATABASE CONNECTED)');
    console.log('----------------------------------------------------');
    process.env.RUNNING_MOCK = 'true';
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/crm_opportunity_tracker', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('----------------------------------------------------');
    console.log('⚠️  COULD NOT CONNECT TO MONGO DB!');
    console.log('⚠️  AUTOMATICALLY FALLING BACK TO IN-MEMORY MOCK MODE');
    console.log('ℹ️  All logins, registers, and CRUDs will work in-memory.');
    console.log('----------------------------------------------------');
    process.env.RUNNING_MOCK = 'true';
  }
};

module.exports = connectDB;
