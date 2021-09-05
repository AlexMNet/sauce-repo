class AppError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.message = message;

    //All erros using this calss will be marked as operational errors
    this.operational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
