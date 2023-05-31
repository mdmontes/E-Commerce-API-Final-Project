const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors')

const autheticateToken = async (req,res,next) =>{

  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError(`No Token Provided`)
  }


  const token = authHeader.split(' ')[1]
  

  // jwt function uses callback function as seen in WebDev Simplified
  jwt.verify(token, process.env.JWT_SECRET,(error,decoded)=>{
    if (error) {
      console.log(token);
      throw new UnauthenticatedError(`Token was recognized, but for this user and token, the following resource cannot be provided`)};
    const {userName, userId, accountType} = decoded 
    req.user = {userName, userId, accountType};
    next()
  })
}

module.exports = autheticateToken