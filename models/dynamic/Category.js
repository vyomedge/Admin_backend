const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = categorySchema;