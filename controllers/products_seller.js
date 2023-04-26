const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')
const {Product} = require('../models/Products')



const createProduct = async (req, res) =>{
  const {
    user: { userId, userName },
    body:{name, price, manufacturer},
  } = req;

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
    user: { userId },
    params: { id: productID },
  } = req

  const productCheck = await Product.findOne({_id: productID})
  if (productCheck.purchased){
    throw new BadRequestError(`This product was already purchased by ${productCheck.buyer_name}. Sellers cannot change the product after it has been purchased`)
  }

  const product = await Product.findByIdAndUpdate(
    {_id: productID, seller_ID: userId },
    req.body,
    { new: true, runValidators: true });


  res.status(StatusCodes.OK).json({product, msg:`the product ${product.name} was updated`})
}

const deleteOneProduct = async (req, res) =>{
  const {
    user: { userId },
    params: { id: productID },
  } = req

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