const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')
const {Product} = require('../models/Products')

const getOneProductShipper = async (req, res) =>{
  const {
    user: {userId},
    params: { id: productID },
  } = req

  const productCheck = await Product.findOne({_id: productID})
  
  if (!productCheck.buyer_ID){
    throw new BadRequestError(`This product has not been purchased. You can only view this product after a purchase has been made`);
  }else if(!productCheck.shipper_ID){
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

    res.status(StatusCodes.OK).json(updatedProducts)
  }
  else{
    const productCheckString = JSON.stringify(productCheck.shipper_ID);
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
    }else{
      throw new BadRequestError(`This product is already being shipped by someone else. You cannot view this product`);
    }
  }
}

const editShipping = async (req, res) =>{
  const {
    user: { userId, userName },
    params: { id: productID },
  } = req

  const productShipperInfo = {shipper_ID: userId, shipper_name:userName };
  const productBody = req.body;
  Object.assign(productBody,productShipperInfo)

  if (productBody.shipping_status == 'On Sale'){
    throw new BadRequestError(`Once a product has been ordered, shippers cannot change the shipping status back to ${productBody.shipping_status}`)
  }

  if (productBody.rating){
    throw new BadRequestError(`This product was already received and rated by buyer. You cannot change the status of this product`)
  }

  const product = await Product.findByIdAndUpdate(
    {_id: productID},
    productBody,
    { new: true, runValidators: true });
  
  if (!product) {
    throw new NotFoundError(`No product with id ${productID}`)}

  res.status(StatusCodes.OK).json({product, msg:`the product ${product.name} was updated by the shipper ${product.shipper_name}`})
}


module.exports = {
  getOneProductShipper,
  editShipping,
}