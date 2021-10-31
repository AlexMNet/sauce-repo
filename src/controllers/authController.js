const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

//Signup a user
exports.signup = asyncHandler(async (req, res, next) => {
  //Check if user exists
  const user = await User.findOne({ username: req.body.username });

  //If there is a user return error
  if (user) return next(new AppError(400, 'user alreayd exists'));

  //create new user with hashed pass
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  //Create Token
  const token = newUser.signToken(newUser._id);

  //Send Success and token resposne to user
  res
    .status(200)
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .json({
      status: 'success',
      message: 'User registration successful!',
    });
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

  if (!user) return next(new AppError(400, 'user not found'));

  //Check if user submitted pass matches hashed pass in database
  const passwordMatch = await user.passwordMatch(password);

  //If password does not match, return error
  if (!passwordMatch)
    return next(new AppError(400, 'Email or password is invalid'));

  //Sign Token
  const token = user.signToken(user._id);

  //Second success response and cookie with token to user
  res
    .status(200)
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .json({
      status: 'success',
      message: 'login successful',
    });
});

//Authenticate users
exports.authenticateUser = asyncHandler(async (req, res, next) => {
  //check for auth token
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: 'fail',
      message: 'Authorization header is required',
    });
  }

  //check if token is in valid format
  const tokenArray = req.headers.authorization.split(' ');

  if (tokenArray[0] !== 'Bearer') {
    return res.status(401).json({
      status: 'fail',
      message: 'Authorization format is invalid',
    });
  }
  const token = tokenArray[1];
  //Promisify jwt.verify since there is no promise based version
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //If token verification fails, return a failed response
  if (!decodedToken) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid authorization token, please try loggin in again.',
    });
  }

  //Add user to the req body. This can be used in checkIfAdmin
  req.user = decodedToken;
  next();
});

//check if user is admin
exports.checkIfAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    res.status(401).json({
      status: 'fail',
      message: 'You must be an admin to access this page',
    });
  }
  next();
};
