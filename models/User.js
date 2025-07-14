const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    panel: { type: String, required: true }, // e.g., Poornam-event, Travel
    canEdit: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false },
    canView: { type: Boolean, default: true },
    canAdd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password & set permissions
userSchema.pre('save', async function () {
  if (this.role === 'admin') {
    this.canEdit = true;
    this.canDelete = true;
    this.canView = true;
    this.canAdd = true;
  } else {
    this.canEdit = false;
    this.canDelete = false;
    this.canView = true;
    this.canAdd = false;
  }

  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = userSchema;