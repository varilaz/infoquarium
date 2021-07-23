const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');



//GET ALL ORDERS
exports.get_all_orders = (req, res, next) => {
    Order.find()
    .select('product quantity _id creator')
    .populate('product')
    .then(docs => {
        //console.log(docs)
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
              console.log(doc.product + ' - ' + 'order')
                return {
                    _id: doc._id,
                    product: doc.product,
                    creator: doc.creator,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })

        })
    })
    .catch(err => {
        console.log(err + "29 sor")
        res.status(500).json({
            error: err
        });
    });
}




  //GET ONE ORDER
  exports.get_one_order =  (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product', 'creator')
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: 'Order not found!'
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}




//POST ONE ORDER
exports.post_one_order =  (req, res, next) => {
    Product.findById(req.body.productId)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        const order = new Order({
          _id: new mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId,
          creator: req.body.creator
        });
        console.log(order + ' - ' + 'add cart 87');
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  }




//PATCH ONE ORDER
exports.patch_one_order = (req, res, next) => {
  const id = req.body.id;
  const updateOps = {};

  for(let [key, value] of Object.entries(req.body)) {
    updateOps[key] = value;
}

  Order.findOneAndUpdate({id: id }, { $set: updateOps })
  .then(result => {
    console.log(result)
      res.status(200).json({
          message: "Order updated",
          request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + id
          }
      })
  })
  .catch(err => {
      res.status(500).json({
          error: err
      })
  })
}




//DELETE ONE ORDER
exports.delete_one_order = (req, res, next) => {
    Order.remove({
        _id: req.params.orderId
    })
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: { productId: 'ID', quantity:'Number'}
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}
