const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
      console.log('Mongo URI:', process.env.MONGO_URI); // Debug log
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    
    process.exit(1);
  }
};

module.exports = connectDB;