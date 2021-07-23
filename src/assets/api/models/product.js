const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price:  {
        type: Number,
        required: true
    },
    productImage: {
        type: String,
        required: true
    },
    description: {
      type: String
    },
    categories: {
      type: Array
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
      }
})


module.exports = mongoose.model('Product', productSchema);
