const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')
const {Product} = require('../models/Products')


const getOneProductBuyer = async (req, res) =>{
  const {
    user: {userId},
    params: { id: productID },
  } = req

  const productCheck = await Product.findOne({_id: productID})
  
  if (!productCheck.buyer_ID){
    const products = await Product.findOne({_id: productID})
    res.status(StatusCodes.OK).json(products);
  }else{
    const productCheckString = JSON.stringify(productCheck.buyer_ID);
    const productCheckClean = productCheckString.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    if (productCheckClean===userId){
      const products = await Product.findOne({_id: productID});
      res.status(StatusCodes.OK).json(products);
    }else{
      throw new NotFoundError(`This product whas purchased by someone else. You cannot view this product`);
    }
  }
}

const buyOneProduct = async (req, res) =>{
  const {
    user: { userId, userName },
    params: { id: productID },
    body:{ purchased: purchased, shipping_status: shipping_status}
  } = req;
  
  const productCheck = await Product.findOne({_id: productID});

  if (productCheck.purchased){
    throw new BadRequestError(`This product was already purchased. You cannot purchase this product again`);
  }else{
      const products = await Product.findByIdAndUpdate(
        {_id: productID},
        {buyer_ID: userId, buyer_name: userName, purchased: purchased, shipping_status: shipping_status},
        { new: true, runValidators: true }
        )
      res.status(StatusCodes.OK).json(products);
  };

}

const editRating = async (req, res) =>{

  const {
    user: { userId },
    params: { id: productID },
  } = req

  const productBody = req.body;
  
  if(productBody.shipping_status === 'Shipped'){
    const product = await Product.findByIdAndUpdate(
      {_id: productID, buyer_ID: userId },
      productBody,
      { new: true, runValidators: true })
    res.status(StatusCodes.OK).json({product, msg:`the product ${product.name} was updated`})
  } else{
    throw new BadRequestError(`You have not received this product. Wait until your product has been delivered.`)
  }
}

module.exports = {
  getOneProductBuyer,
  buyOneProduct,
  editRating
}