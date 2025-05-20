const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  prenom: String,
  nom: String,
  email: { type: String, unique: true },
  identifiant: { type: String, unique: true },
  mdp: String,
  createdAt: { type: Date, default: Date.now },
  topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports = mongoose.model('User', userSchema);
