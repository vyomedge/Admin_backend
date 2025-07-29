const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
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
  metaTitle: {
    type: String,
    default: '',
    trim: true,
  },
  metaDescription: {
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

module.exports = categorySchema
// module.exports = {
//   Category: categorySchema,  // ✅ just export schema, NOT model
// };