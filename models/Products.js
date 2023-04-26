const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'product name must be provided'],
  },

  price: {
    type: Number,
    required: [true, 'product price must be provided'],
  },
  
  featured: {
    type: String,
    enum: ['Yes','No'],
    default: false,
  },

  purchased: {
    type: Boolean,
    default: false,
  },

  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  manufacturer: {
    type: String,
    required: [true, 'manufacturer must be provided']},

  shipping_status: {
    type: String,
    enum: ['On Sale','Ordered','On Route', 'Shipped'],
    default: 'On Sale'},
  
  seller_name: {
    type: String,
    },

  seller_ID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    },

  shipper_name: {
    type: String,
    },

  shipper_ID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    },
  
  buyer_name: {
    type: String,
    },

  buyer_ID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    }
  },

    { timestamps: true })

const Product = mongoose.model('Product', productSchema)
module.exports = {Product}

// module.exports = mongoose.model('Product', productSchema)



