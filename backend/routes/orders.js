const router = require('express').Router();
const { createOrder, getMyOrders, getOrder, payOrder, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/pay', payOrder);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
