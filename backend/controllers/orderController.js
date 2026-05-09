const Order = require('../models/Order');
const Cart = require('../models/Cart');
const sendEmail = require('../utils/sendEmail');

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
    if (!orderItems?.length) return res.status(400).json({ success: false, message: 'No order items' });
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      trackingNumber: 'TRK' + Date.now(),
    });
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Send confirmation email
    const orderItemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.qty).toLocaleString()}</td>
      </tr>
    `).join('');

    try {
      await sendEmail({
        email: req.user.email,
        subject: `Order Confirmation - ShopZone (#${order._id})`,
        message: `Thank you for your order! Your order ID is ${order._id}.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #4CAF50; text-align: center;">Order Placed Successfully!</h2>
            <p>Hi ${req.user.name},</p>
            <p>Thank you for shopping with ShopZone. Your order has been received and is being processed.</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Summary</h3>
              <p><strong>Order ID:</strong> #${order._id}</p>
              <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
              <table style="width: 100%; border-collapse: collapse;">
                ${orderItemsHtml}
                <tr>
                  <td style="padding: 10px; font-weight: bold;">Total Amount</td>
                  <td style="padding: 10px; font-weight: bold; text-align: right;">₹${order.totalPrice.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <p>We will notify you once your order has been shipped.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8rem; color: #777; text-align: center;">&copy; 2024 ShopZone MCA Project. All rights reserved.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error('Order email failed:', err);
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = { id: req.body.id, status: 'COMPLETED', updateTime: new Date().toISOString() };
    order.orderStatus = 'Processing';
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (['Shipped', 'Delivered'].includes(order.orderStatus))
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    order.orderStatus = 'Cancelled';
    await order.save();
    res.json({ success: true, order, message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
