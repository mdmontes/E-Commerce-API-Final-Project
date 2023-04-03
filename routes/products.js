const express = require('express')
const router = express.Router()
const { 
  getAllMyProducts, 
  createProduct, 
  getOneProduct, 
  editOneProduct, 
  deleteOneProduct
} = require('../controllers/products_seller')

router.route('/').get(getAllMyProducts).post(createProduct);  
router.route('/:id').get(getOneProduct).patch(editOneProduct).delete(deleteOneProduct) 

module.exports = router