const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  colour:{
    type: String,
    required: true,
  },
  formfactor:{
    type: String,
    required: true,
  },
  connectivity:{
    type: String,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
    required: true,
  },  
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: String
  },
  productImage: [
    {
      fileName: String,
      originalname: String,
      path: String,
    },
  ],
});

const productCollection = mongoose.model("Product", productSchema);

module.exports = productCollection;