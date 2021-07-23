const express = require('express');
const router = express.Router();

const checkAuthMiddleware = require('../middleware/checkout-auth');
const OrdersController = require('../controllers/orders')



//GET ALL ORDERS
router.get('/', checkAuthMiddleware, OrdersController.get_all_orders);



//GET ONE ORDER
router.get('/:orderId', checkAuthMiddleware, OrdersController.get_one_order);



//POST ORDER
router.post("/", checkAuthMiddleware, OrdersController.post_one_order);



//PATCH ONE ORDER
router.patch("/:orderId", checkAuthMiddleware, OrdersController.patch_one_order);



//DELETE ORDER
router.delete('/:orderId', checkAuthMiddleware, OrdersController.delete_one_order);





module.exports = router;
