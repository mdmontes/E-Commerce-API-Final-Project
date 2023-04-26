const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')
const {Product} = require('../models/Products')



const createProduct = async (req, res) =>{
  const {
    user: { userId, name },
  } = req;

 const productSellerInfo = {seller_ID: userId, seller_name:name };
 const productBody = req.body;

 if (productBody.price< 0){
  throw new BadRequestError('Price cannot be negative. Please submit a new price')
 }

  Object.assign(productBody,productSellerInfo)

  const product = await Product.create(productBody) ;
  res.status(StatusCodes.CREATED).json({product, msg:`the product ${product.name} was created`});
}

const getOneProductSeller = async (req, res) =>{

  const {
    user: { userId },
    params: { id: productID },
  } = req
  
  const products = await Product.findOne({_id: productID, seller_ID: userId })

  if (!products || products === null) {
    throw new NotFoundError(`This product could not be viewed because it does not belong to this seller`)}

  res.status(StatusCodes.OK).json(products);
}

const editOneProduct = async (req, res) =>{
  const {
    body:{name, price, manufacturer},
    user: { userId },
    params: { id: productID },
  } = req

  if (!name ||!price ||!manufacturer){
    throw new BadRequestError(`Bad Request Error. Check to make sure you properly modified the NAME, PRICE, and/or MANUFACTURER`)
  }

  const product = await Product.findByIdAndUpdate(
    {_id: productID, createdBy_ID: userId },
    req.body,
    { new: true, runValidators: true })
  
  if (!product) {
    throw new NotFoundError(`No product with id ${productID}`)}

  res.status(StatusCodes.OK).json({product, msg:`the product ${product.name} was updated`})
}

const deleteOneProduct = async (req, res) =>{
  const {
    user: { userId },
    params: { id: productID },
  } = req

  const products = await Product.findOneAndDelete({
    _id: productID, 
    createdBy_ID: userId })

  if (!products) {
    throw new NotFoundError(`No product with id ${productID}`)}

  res.status(StatusCodes.OK).json({msg: `The product ${products.name} with productid was deleted`});  
}

module.exports = {
  createProduct,
  getOneProductSeller,
  editOneProduct,
  deleteOneProduct,
}