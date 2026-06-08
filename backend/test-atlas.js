const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('Testing Atlas connection...');
  console.log('Connection string:', process.env.MONGO_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully to Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    process.exit(1);
  }
};

testConnection();