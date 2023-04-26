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

//Routes to All Users
router.route('/').get(getAllProducts);  
router.route('/myproducts').get(getAllMyProducts);

//Routes to Sellers
router.route('/seller/:id').get(getOneProductSeller)
router.route('/seller').post(createProduct)


//Routes to Buyers:
router.route('/buyer/:id').get(getOneProductBuyer)
router.route('/buy/:id').patch(buyOneProduct);

module.exports = router