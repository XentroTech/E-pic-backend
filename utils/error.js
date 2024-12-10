const ErrorHandler = require("./errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Mongodb Cast Error
  if (err.name === "CastError") {
    const message = `Resource not found . Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // MOngoose duplicate key error

  if (err.code === 11000) {
    const message = `${Object.keys(err.keyValue)} Already Registered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error

  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }
  //  JWT expire error

  if (err.name === "JsonWebExpireError") {
    const message = `Json Web Token is expired, Try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).send({
    success: false,
    message: err.message,
  });
};
