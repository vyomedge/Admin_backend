const mongoose = require("mongoose");
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    uid: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    authorName: {
      type: String,
      required: false,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      validate: [(tags) => tags.length <= 10, "Maximum 10 tags allowed"],
    },
    featuredImage: {
      url: {
        type: String,
        required: false,
      },
      altText: {
        type: String,
        required: false,
        trim: true,
      },
    },
    meta: {
      title: {
        type: String,
        required: true,
        maxlength: 60,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        maxlength: 160,
        trim: true,
      },
      keywords: {
        type: String,
        trim: true,
      },
      canonicalUrl: {
        type: String,
      },
    },
    ogTags: {
      title: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      image: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Scheduled"],
      default: "Draft",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "lastUpdatedAt",
    },
  }
);
blogSchema.index({ uid: 1, category: 1 });
module.exports = blogSchema;
