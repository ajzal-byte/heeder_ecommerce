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
    type: mongoose.Schema.Types.ObjectId,
    ref: "brandCollection"
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category"
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
  offerStatus: {
    type: String,
  },
  discountPercentage: {
    type: Number,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
},
{ timestamps: true }
);

const productCollection = mongoose.model("Product", productSchema);

module.exports = productCollection;