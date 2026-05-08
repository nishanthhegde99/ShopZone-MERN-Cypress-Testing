const router = require('express').Router();
const { getProducts, getProduct, getFeaturedProducts, getCategories, addReview, getRecommendations } = require('../controllers/productController');
const { protect } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.get('/:id/recommendations', getRecommendations);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
