const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
});


const userCollection =  mongoose.model("userCollection", user_schema);
module.exports = userCollection