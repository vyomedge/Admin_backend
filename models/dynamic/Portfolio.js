// const mongoose = require('mongoose');

// const portfolioSchema = new mongoose.Schema({
//   images: [{ type: String, required: true }], 
// }, { timestamps: true });

// module.exports = portfolioSchema;

const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  images: [
    {
      url: String,
      public_id: String,
    }
  ]
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
