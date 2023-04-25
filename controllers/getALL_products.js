const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')
const {Product} = require('../models/Products')


const getAllProducts = async (req, res) =>{
  const products = await Product.find().sort('createdAt')
  res.status(StatusCodes.OK).json({ products, count: products.length });
}


const getAllMyProducts = async (req, res) =>{
  const {
    user: { userId, accountType },
  } = req

  if (accountType === 'seller'){
    const products = await Product.find({ seller_ID: userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ products, count: products.length });
  }

  else if(accountType === 'shipper'){
    const products = await Product.find({ shipper_ID: userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ products, count: products.length });
  }

  else if(accountType === 'buyer'){
    const products = await Product.find({ buyer_ID: userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ products, count: products.length });
  }
  
}

module.exports = {
  getAllProducts,
  getAllMyProducts
}