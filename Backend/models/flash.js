const mongoose = require('mongoose');

const flashSchema = new mongoose.Schema({
  question: { type: String, unique: true,trim: true },
  answer: { type: String,trim: true },
   
});

const headSchema= new mongoose.Schema({
  topic:{type: String, unique: true},
  flashcards: [flashSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
})

module.exports = {
  Flash: mongoose.model('Flash', flashSchema),
  Head: mongoose.model('Head', headSchema)
};