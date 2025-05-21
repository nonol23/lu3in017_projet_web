const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true },
  topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);