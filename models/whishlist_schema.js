const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
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

const wishlistCollection = mongoose.model('wishlist', wishlistCollection);
module.exports = wishlistCollection;