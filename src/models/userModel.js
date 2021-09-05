const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: [true, 'Must provide a username'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Must provide a valid email'],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Must Provide a password'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

module.exports = mongoose.model('User', userSchema);
