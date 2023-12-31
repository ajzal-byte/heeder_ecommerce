const mongoose = require('mongoose');

const wishlistCollection = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer"
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
        }
    }]
})

const wishlist = mongoose.model('wishlist', wishlistCollection);
module.exports = wishlist;