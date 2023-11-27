const express = require("express");
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true
  },
  isListed: {
    type: String,
    default: true
  },
});

const brandCollection = mongoose.model("brandCollection", brandSchema);

module.exports = brandCollection;