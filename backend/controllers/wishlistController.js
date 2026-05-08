const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name images price ratings');
    res.json({ success: true, wishlist: wishlist || { products: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });
    const index = wishlist.products.indexOf(productId);
    let message;
    if (index > -1) {
      wishlist.products.splice(index, 1);
      message = 'Removed from wishlist';
    } else {
      wishlist.products.push(productId);
      message = 'Added to wishlist';
    }
    await wishlist.save();
    res.json({ success: true, wishlist, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
