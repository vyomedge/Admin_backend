const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  images: [{ type: String, required: true }], 
}, { timestamps: true });

module.exports = portfolioSchema;