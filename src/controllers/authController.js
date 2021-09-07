const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
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
      role: req.body.role,
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
