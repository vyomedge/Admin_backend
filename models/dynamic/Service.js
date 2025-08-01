const mongoose = require('mongoose');

const Serviceschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },

  image: {
    type: String,
    default: '',
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = Serviceschema

