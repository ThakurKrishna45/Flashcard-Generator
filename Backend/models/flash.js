const mongoose = require('mongoose');

const flashSchema = new mongoose.Schema({
  question: { type: String, unique: true,trim: true },
  answer: { type: String,trim: true },
});

module.exports = mongoose.model('Flash', flashSchema);