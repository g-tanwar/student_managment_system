const ApiError = require('../utils/ApiError');

// Middleware to catch 404 routes
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

// Centralized error handler
const globalErrorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  if (!statusCode) statusCode = 500;
  if (!message) message = 'Internal Server Error';

  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
};
