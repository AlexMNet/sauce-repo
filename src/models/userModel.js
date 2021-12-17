const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
  passwordResetToken: String,
  passwordResetExpires: Date,
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

//Send response to user
userSchema.methods.sendResponse = function (res, statusCode, message, token) {
  return res
    .status(statusCode)
    .cookie('access_token', token, {
      httpOnly: true,
      //If true, cookie only works with https and not http. Disable for development
      // secure: process.env.NODE_ENV === 'production',
    })
    .json({
      status: 'success',
      message,
    });
};

//Check if passwords match
userSchema.methods.passwordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generate Reset Token
userSchema.methods.createPasswordResetToken = function () {
  //create reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  //Hash and save the token into the database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //set expiry time
  this.passwordResetExpires = Date.now() + 10 * 60 * 10000;

  //return token
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
