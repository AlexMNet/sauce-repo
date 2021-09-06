const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
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

//User login
exports.login = asyncHandler(async (req, res, next) => {
  //check for username and password in req body
  const { username, password } = req.body;

  //If username or password not found, throw error message
  if (!username || !password) {
    return next(new AppError(400, 'Please provide a username and password!'));
  }

  //Fetch user
  const user = await User.findOne({ username: username });

  if (user) {
    //Check if user submitted pass matches hashed pass in database
    const passwordMatch = await bcrypt.compare(password, user.password);

    //If passwords match and username subitted equals username of user found send token
    if (passwordMatch && user.username === username) {
      const token = signToken(user._id, user.username, user.role);

      res.status(200).json({
        status: 'success',
        token,
        message: 'login successful',
      });
    } else {
      res.status(401).json({
        status: 'fail',
        message: 'email or password is incorrect',
      });
    }
  } else {
    res.status(400).json({
      status: 'fail',
      message: 'user not found',
    });
  }
});

exports.authenticateUser = async (req, res, next) => {
  console.log(req.headers);
};
