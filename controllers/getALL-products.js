const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')
const {Product} = require('../models/Products')


const getAllProducts = async (req, res) =>{
  const products = await Product.find().sort('createdAt')
  updatedProductList = [];
  for( let i = 0; i < products.length; i++){
    updatedProducts= {
      name : products[i].name,
      price: products[i].price,
      featured: products[i].featured,
      rating: products[i].rating,
      createdAt: products[i].createdAt,
      manufacturer: products[i].manufacturer,
      shipping_status: products[i].shipping_status,
      seller_name: products[i].seller_name,
      purchased: products[i].purchased,
      _id: products[i]._id
    };
    updatedProductList.push(updatedProducts)
  };
  res.status(StatusCodes.OK).json({ products:updatedProductList, count: products.length });
}


const getAllMyProducts = async (req, res) =>{

  const { user: { userId, accountType }} = req

  var searchObject = {};
  
  if (accountType === 'seller'){
    searchObject = { seller_ID: userId };
  }
  else if(accountType === 'shipper'){
    searchObject = { shipper_ID: userId };
  }
  else{
    searchObject = { buyer_ID: userId };
  };

  const products = await Product.find(searchObject).sort('createdAt');
  updatedProductList = [];

  for( let i = 0; i < products.length; i++){
    updatedProducts= {
      name : products[i].name,
      price: products[i].price,
      featured: products[i].featured,
      rating: products[i].rating,
      createdAt: products[i].createdAt,
      manufacturer: products[i].manufacturer,
      shipping_status: products[i].shipping_status,
      seller_name: products[i].seller_name,
      purchased: products[i].purchased,
      _id: products[i]._id
    };
    updatedProductList.push(updatedProducts)
  };

  res.status(StatusCodes.OK).json({ products: updatedProductList, count: products.length })
  
}

module.exports = {
  getAllProducts,
  getAllMyProducts
}