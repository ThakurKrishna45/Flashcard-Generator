const mongoose = require('mongoose');

// const flashSchema = new mongoose.Schema({
//   question: { type: String, unique: true,trim: true },
//   answer: { type: String,trim: true },
   
// });


const newheadSchema = new mongoose.Schema({
  topic: { type: String, unique: true },
  flashcards: [
    {
      question: { type: String, trim: true },
      answer: { type: String, trim: true }
    }
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
const Head = mongoose.model('Head', newheadSchema, 'newheads');


module.exports = {
  Head
};


