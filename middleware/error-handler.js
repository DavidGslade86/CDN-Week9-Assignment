const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong. Try again Later.',
  }

  if (err instanceof CustomAPIError){
    return res.status(err.statusCode).json({msg: err.message});
  }

  if(err.name === 'ValidationError') {
    console.log(err.errors);
    customError.message = Object.values(err.errors).map((item) => item.message).join(' ');
  }

  if(err.code && err.code === 11000) {
    customError.message = `We already have an account with that ${Object.keys(err.keyValue)}. Please log in or use a different value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if(err.name === 'CastError'){
    customError.message = `No item with id ${err.value} was found.`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({msg: customError.message})
}

module.exports = errorHandlerMiddleware
