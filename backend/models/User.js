const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'top_admin'],
      default: 'user',
    },
    refreshToken: { type: String },
    profileImage: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
    },
    coverImage: {
      url: { type: String, default: '' },
      fileId: { type: String, default: '' },
    },
    description: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: 0,
    },
    
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
