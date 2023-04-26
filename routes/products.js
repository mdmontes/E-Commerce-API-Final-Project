const express = require('express')
const router = express.Router()

// Get calls for all users
const{getAllProducts, getAllMyProducts} = require('../controllers/getALL_products')

// API Calls to Sellers
const { 
  createProduct, 
  getOneProductSeller, 
  editOneProduct, 
  deleteOneProduct
} = require('../controllers/products_seller')

//API Calls to Buyers
const { 
  getOneProductBuyer,
  buyOneProduct,
  editRating,
} = require('../controllers/products_buyer')

//API Calls to Shippers
const { 
  getOneProductShipper,
  editShipping,
} = require('../controllers/products_shipper')

//Routes to All Users
router.route('/').get(getAllProducts);  
router.route('/myproducts').get(getAllMyProducts);

//Routes to Sellers
router.route('/seller/:id').get(getOneProductSeller);
router.route('/seller/:id').patch(editOneProduct);
router.route('/seller/:id').delete(deleteOneProduct);
router.route('/seller').post(createProduct);


//Routes to Buyers:
router.route('/buyer/:id').get(getOneProductBuyer);
router.route('/buyer/:id').patch(editRating);
router.route('/buy/:id').patch(buyOneProduct);

//Routes to Shippers:
router.route('/shipper/:id').get(getOneProductShipper);
router.route('/shipper/:id').patch(editShipping);




module.exports = router