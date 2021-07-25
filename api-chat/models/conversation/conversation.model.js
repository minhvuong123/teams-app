const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: ''
    },
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', ConversationSchema);