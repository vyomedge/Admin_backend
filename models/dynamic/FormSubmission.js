const mongoose = require("mongoose");
const { Schema } = mongoose;

const formSubmissionSchema = new Schema(
  {
    formType: {
      type: String,
      required: true,
      enum: ["home", "contactus", "modalform"],
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phoneNo: {
      type: String,
      trim: true,
      required: false,
    },
    weddingDate: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
    },
    numberOfGuests: {
      type: Number,
      min: 1,
    },
    message: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    sourcePage: {
      type: String,
      trim: true,
    },
    uniqueKey: {
      type: String,
      unique: true, // ✅ Required to enforce uniqueness
      index: true,   // ✅ Makes sure MongoDB creates the index
    },
  },
  { timestamps: true }
);



formSubmissionSchema.pre("validate", function (next) {
  const name = this.fullName?.trim().toLowerCase();
  const form = this.formType;

  if (!name || !form) {
    return next(new Error("Full name and formType are required"));
  }

  if (this.email) {
    const email = this.email.trim().toLowerCase();
    this.uniqueKey = `${email}_${name}_${form}`;
  } else {
    this.uniqueKey = `${name}_${form}`;
  }
  next();
});




module.exports = formSubmissionSchema
