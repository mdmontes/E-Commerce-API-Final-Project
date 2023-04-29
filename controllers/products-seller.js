const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError,UnauthenticatedError} = require('../errors')
const {Product} = require('../models/Products')



const createProduct = async (req, res) =>{
  const {
    user: { userId, userName, accountType},
    body:{name, price, manufacturer},
  } = req;

  if(accountType!=='seller'){
    throw new UnauthenticatedError(`Token was recognized, but for this user and token, the following resource cannot be provided. This route is for seller accounts only. Check to make sure you have logged in as a seller`)
  }; 

  const productSellerInfo = {seller_ID: userId, seller_name:userName };
  const productBody = req.body;

  if (!name ||!price ||!manufacturer){
    throw new BadRequestError(`Bad Request Error. Check to make sure you properly modified the NAME, PRICE, and/or MANUFACTURER`)
  };

  if (productBody.price< 0){
    throw new BadRequestError('Price cannot be negative. Please submit a new price')
   };

  Object.assign(productBody,productSellerInfo)

  const product = await Product.create(productBody) ;
  res.status(StatusCodes.CREATED).json({msg:`the product ${product.name} was created`});
}

const getOneProductSeller = async (req, res) =>{

  const {
    user: { userId, accountType},
    params: { id: productID },
  } = req
  
  if(accountType!=='seller'){
    throw new UnauthenticatedError(`Token was recognized, but for this user and token, the following resource cannot be provided. This route is for seller accounts only. Check to make sure you have logged in as a seller`)
  }; 

  const products = await Product.findOne({_id: productID, seller_ID: userId })

  if (!products || products === null) {
    throw new NotFoundError(`This product could not be viewed because it does not belong to this seller`)}
  
  updatedProducts= {
    name : products.name,
    price: products.price,
    featured: products.featured,
    rating: products.rating,
    manufacturer: products.manufacturer,
    shipping_status: products.shipping_status,
    _id: products._id
  };

  res.status(StatusCodes.OK).json(updatedProducts);
}

const editOneProduct = async (req, res) =>{
  const {
    user: { userId, accountType},
    params: { id: productID },
  } = req

  if(accountType!=='seller'){
    throw new UnauthenticatedError(`Token was recognized, but for this user and token, the following resource cannot be provided. This route is for seller accounts only. Check to make sure you have logged in as a seller`)
  }; 

  const productBody = req.body;

  if (productBody.price< 0){
    throw new BadRequestError('Price cannot be negative. Please submit a new price')
   };

  const productCheck = await Product.findOne({_id: productID})
  if (productCheck.purchased){
    throw new BadRequestError(`This product was already purchased by ${productCheck.buyer_name}. Sellers cannot change the product after it has been purchased`)
  }

  const product = await Product.findByIdAndUpdate(
    {_id: productID, seller_ID: userId },
    productBody,
    { new: true, runValidators: true });


  res.status(StatusCodes.OK).json({ msg:`the product ${product.name} was updated`})
}

const deleteOneProduct = async (req, res) =>{
  const {
    user: { userId, accountType },
    params: { id: productID },
  } = req

  if(accountType!=='seller'){
    throw new UnauthenticatedError(`Token was recognized, but for this user and token, the following resource cannot be provided. This route is for seller accounts only. Check to make sure you have logged in as a seller`)
  }; 

  const productCheck = await Product.findOne({_id: productID})

  if (productCheck.purchased){
    throw new BadRequestError(`This product was already purchased by ${productCheck.buyer_name}. Sellers cannot delete the product after it has been purchased`)
  }

  const products = await Product.findOneAndDelete({
    _id: productID, 
    seller_ID: userId })

  res.status(StatusCodes.OK).json({msg: `The product ${products.name} with productid was deleted`});  
}

module.exports = {
  createProduct,
  getOneProductSeller,
  editOneProduct,
  deleteOneProduct,
}