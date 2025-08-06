const mongoose = require('mongoose');
const { Schema } = mongoose;

const portfolioSchema = new Schema({
  category: {
      type: mongoose.Schema.Types.ObjectId,
         ref: "Category",
         required: true,
         trim: true,
  },
  
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
  ],
}, { timestamps: true });

module.exports =  portfolioSchema;
