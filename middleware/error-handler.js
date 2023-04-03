const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

// console.log(err.name)
// console.log(err.message)
// console.log(err.value)

  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
    customError.statusCode = 400
  };
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`
    customError.statusCode = 400
  };

  if (err.type === "entity.parse.failed"){
    customError.msg = `Something has occured in the front end of this application that is sending unparsable JSON data. Developer should look at how the name, email, or password fields are capturing the user's input. There could be a comma incorrectly placed somewhere `
    customError.statusCode = 500
  };
  
  if (err.name === 'CastError') {
    if (err.valueType === "string"){
      customError.msg = `No item found with id : ${err.value}`;
      customError.statusCode = 404}else{
        customError.msg = `No item found with id : ${err.value._id}`;customError.statusCode = 404
      };
  };
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
