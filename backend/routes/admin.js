const router = require('express').Router();
const { getDashboardStats, getAllUsers, deleteUser, getAllOrders, updateOrderStatus, createProduct, updateProduct, deleteProduct } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);
router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
