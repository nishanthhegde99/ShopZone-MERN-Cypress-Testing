const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find().select('totalPrice orderStatus createdAt'),
    ]);
    const totalRevenue = orders.filter((o) => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');
    res.json({ success: true, stats: { totalUsers, totalProducts, totalOrders, totalRevenue }, recentOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }
    await order.save();

    // Send Status Update Email
    try {
      await sendEmail({
        email: order.user.email,
        subject: `Order Status Updated - ShopZone (#${order._id})`,
        message: `Your order status has been updated to: ${order.orderStatus}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #f39c12; text-align: center;">Order Status Update</h2>
            <p>Hi ${order.user.name},</p>
            <p>We wanted to let you know that your order status has been updated.</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="font-size: 1.1rem; margin-bottom: 5px;">New Status:</p>
              <h2 style="color: #2c3e50; margin-top: 0;">${order.orderStatus}</h2>
              <p style="color: #777; font-size: 0.9rem;">Order ID: #${order._id}</p>
            </div>

            <p>You can track your order in your profile dashboard.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #777; text-align: center;">&copy; 2024 ShopZone MCA Project. All rights reserved.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Status update email failed:', err);
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
