const express = require('express')
const router = express.Router()

const { 

  createProduct, 
  getOneProduct, 
  editOneProduct, 
  deleteOneProduct
} = require('../controllers/products_seller')


const{getAllProducts, getAllMyProducts} = require('../controllers/getALL_products')

router.route('/').get(getAllProducts);  
router.route('/myproducts').get(getAllMyProducts);

module.exports = router