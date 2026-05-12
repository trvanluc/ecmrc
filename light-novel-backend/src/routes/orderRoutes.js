const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate');
const { createOrderSchema } = require('../validations/schemas');

const { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  cancelOrder 
} = require('../controllers/orderController');

const { protect } = require('../middlewares/auth');

router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;