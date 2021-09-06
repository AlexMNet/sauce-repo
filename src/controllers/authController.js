const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');

//Sign Token Function
const signToken = (id, username, role) =>
  jwt.sign({ id, username, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

//Signup a user
exports.signup = asyncHandler(async (req, res, next) => {
  //Check if user exists
  const user = await User.findOne({ username: req.body.username });

  //If no user, register user
  if (!user) {
    //hash user pass, also at + to saltrounds to change string to a number
    const hashedPass = await bcrypt.hash(
      req.body.password,
      +process.env.SALTROUNDS
    );

    //create new user with hashed pass
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    //Create Token
    const token = signToken(newUser._id, newUser.username, newUser.role);

    //Send Success and token resposne to user
    res.status(200).json({
      status: 'success',
      message: 'User registration successful!',
      token,
    });
  } else {
    //if no user send a failed response
    res.status(400).json({
      status: 'fail',
      message: 'user already exists',
    });
  }
});
