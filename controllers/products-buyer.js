const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError} = require('../errors')
const {Product} = require('../models/Products')


const getOneProductBuyer = async (req, res) =>{
  const {
    user: {userId, accountType},
    params: { id: productID },
  } = req

  if(accountType!=='buyer'){
    throw new UnauthenticatedError(`Token was recognized, but for this user and token, the following resource cannot be provided. This route is for buyer accounts only. Check to make sure you have logged in as a buyer`)
  }; 

  const productCheck = await Product.findOne({_id: productID})
  
  if (!productCheck.buyer_ID){
    const products = await Product.findOne({_id: productID});
   
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
  }else{
    const productCheckString = JSON.stringify(productCheck.buyer_ID);
    const productCheckClean = productCheckString.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    if (productCheckClean===userId){
      const products = await Product.findOne({_id: productID});

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
      } else{
      throw new BadRequestError(`This product whas purchased by someone else. You cannot view this product`)}
    }
}

const buyOneProduct = async (req, res) =>{
  const {
    user: { userId, userName, accountType },
    params: { id: productID },
    body:{ purchased: purchased, shipping_status: shipping_status}
  } = req;
  
  if(accountType!=='buyer'){
    throw new UnauthenticatedError(`Token was recognized, but for this user and token, the following resource cannot be provided. This route is for buyer accounts only. Check to make sure you have logged in as a buyer`)
  };
  
  const productCheck = await Product.findOne({_id: productID});

  if (productCheck.purchased){
    throw new BadRequestError(`This product was already purchased. You cannot purchase this product again`);
  }else{
      const product = await Product.findByIdAndUpdate(
        {_id: productID},
        {buyer_ID: userId, buyer_name: userName, purchased: purchased, shipping_status: shipping_status},
        { new: true, runValidators: true }
        )
      res.status(StatusCodes.OK).json({msg:`the user ${product.buyer_name} has purchased ${product.name}`});
  };

}

const editRating = async (req, res) =>{

  const {
    user: { userId, accountType },
    params: { id: productID },
  } = req

  if(accountType!=='buyer'){
    throw new UnauthenticatedError(`Token was recognized, but for this user and token, the following resource cannot be provided. This route is for buyer accounts only. Check to make sure you have logged in as a buyer`)
  };

  const productBody = req.body;
  if (productBody.rating <0){
    throw new BadRequestError('You cannot give a negative rating.')
  }
  

  if(productBody.shipping_status === 'Shipped'){
    const product = await Product.findByIdAndUpdate(
      {_id: productID, buyer_ID: userId },
      productBody,
      { new: true, runValidators: true })
    res.status(StatusCodes.OK).json({msg:`the product ${product.name} was updated with a rating`})
  } else{
    throw new BadRequestError(`You have either not purchased, or you have not received this product. Wait until your product has been delivered if you purchased it. If you have not purchased the product, you must purchase it first.`)
  }
}

module.exports = {
  getOneProductBuyer,
  buyOneProduct,
  editRating
}