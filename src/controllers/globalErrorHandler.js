const AppError = require('../utils/appError');

const handleCastErr = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateErr = (err) => {
  const field = Object.keys(err.keyValue);
  const value = Object.values(err.keyValue);
  const message = `${field}: ${value}. Is a dupliate! Please use another value!`;
  return new AppError(400, message);
};

const handleValidationErrorDB = (err) => {
  //Take the message from each error that is thrown and save into an array
  const errors = Object.values(err.errors).map((el) => el.message);

  //join the elements of the array to create an error message
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(400, message);
};

const sendDevErr = (err, res) => {
  res.status(err.statusCode).json({
    name: err.name,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdErr = (err, res) => {
  if (err.operational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('ERROR⚠️', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong...',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevErr(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //Mongoose Duplicate Error
    if (err.code === 11000) err = handleDuplicateErr(err);
    //Mongoose CastError
    if (err.name === 'CastError') err = handleCastErr(err);

    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    sendProdErr(err, res);
  }
};
