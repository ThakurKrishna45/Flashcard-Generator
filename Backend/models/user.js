// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true,trim: true },
  password: { type: String, required: true, minlength: 6,trim: true },
  fullName: { type: String, required: true,trim: true },
  gmail: { type: String, required: true,unique: true },
});

module.exports = mongoose.model('User', userSchema);