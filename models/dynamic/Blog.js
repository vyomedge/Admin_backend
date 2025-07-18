
const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  authorName: {
    type: String,
    required: false,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: {
    type: [String],
    validate: [tags => tags.length <= 10, 'Maximum 10 tags allowed']
  },
  uid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  featuredImage: {
    url: {
      type: String,
      required: false,
     
    },
    altText: {
      type: String,
      required: false,
      trim: true
    }
  },
  meta: {
    title: {
      type: String,
      required: true,
      maxlength: 60,
      trim: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 160,
      trim: true
    },
    keywords: {
      type: String, // comma-separated
      trim: true
    },
    canonicalUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+$/.test(v);
        },
        message: 'Canonical URL must be a valid URL'
      },
      trim: true
    }
  },
  ogTags: {
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    }
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Scheduled'],
    default: 'Draft'
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'lastUpdatedAt'
  }
});


module.exports = blogSchema;