const express = require("express");
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  isListed: {
    type: String,
    default: true
  },
});

const category = mongoose.model("Categories", categorySchema);

module.exports = category;