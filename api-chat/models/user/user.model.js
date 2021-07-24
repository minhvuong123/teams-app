const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      default: ''
    },
    user_avatar: {
      type: String,
      default: ''
    },
    user_email: {
      type: String,
      required: true
    },
    user_phone: {
      type: String
    },
    user_password: {
      type: String,
      required: true
    },
    user_role: {
      type: String,
      default: 'normal'
    },
  },
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model('User', userSchema);