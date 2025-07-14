// config/usersDb.js
const mongoose = require('mongoose');
const userSchema = require('../models/User');

const usersConnection = mongoose.createConnection(process.env.MONGO_URI, {
  dbName: 'users',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = usersConnection.model('User', userSchema);

module.exports = User;