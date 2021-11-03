const jwt = require('jsonwebtoken');
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
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  //Create Token
  const token = newUser.signToken(newUser._id, newUser.role);

  //Send Success and token resposne to user
  newUser.sendResponse(res, 200, 'user registration successful', token);
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

  //If password does not match, return error and log out user (possibly not need to log out user)
  if (!passwordMatch) {
    return res.clearCookie('access_token').status(400).json({
      status: 'fail',
      message: 'email or password is invalid',
    });
    // next(new AppError(400, 'Email or password is invalid'));
  }

  //Sign Token
  const token = user.signToken(user._id, user.role);

  //Second success response and cookie with token to user
  user.sendResponse(res, 200, 'login successful', token);
});

//Check if user is logged in
exports.authorization = asyncHandler(async (req, res, next) => {
  //Check for jwt token in the cookie
  const token = req.cookies.access_token;

  //If not token, send error
  if (!token) return next(new AppError(403, 'please log in to view this page'));

  //verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Add token information to req object
    req.userId = decoded.id;
    req.userRole = decoded.role;

    return next();
  } catch (err) {
    return next(new AppError(403, 'access token is invalid. Please login'));
  }
});

//Logout user
exports.logout = (req, res, next) =>
  res
    .clearCookie('access_token')
    .status(200)
    .json({ status: 'success', message: 'Successfully logged out!' });

//check if user is admin
exports.checkIfAdmin = async (req, res, next) => {
  if (req.userRole !== 'admin') {
    return next(new AppError(401, 'You must be an admin to access this page!'));
  }
  next();
};

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { password, newPassword, newPasswordConfirm } = req.body;

  //Find user from req.userId (user is already logged in)
  const user = await User.findById(req.userId);

  //Check if user submitted pass matches hashed pass in database
  const passwordMatch = await user.passwordMatch(password);

  //If password does not match, return error
  if (!passwordMatch)
    return next(new AppError(400, 'Email or password is invalid'));

  //Reset password
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  //Create token
  const token = user.signToken(user._id, user.role);

  //Send resposne
  user.sendResponse(res, 200, 'new password saved!', token);
});

//TODO: Forgot Password
//TODO: Reset Password
