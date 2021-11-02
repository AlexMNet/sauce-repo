const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
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
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      msg: 'Passwords are not matching!',
    },
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  const hashedPass = await bcrypt.hash(this.password, +process.env.SALTROUNDS);
  this.password = hashedPass;
  this.passwordConfirm = undefined;
  next();
});

//Sign JWT Token
userSchema.methods.signToken = function (id, role) {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  return token;
};

//Check if passwords match
userSchema.methods.passwordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
