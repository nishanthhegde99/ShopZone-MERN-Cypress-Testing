const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  { name: 'iPhone 15 Pro Max', description: 'Latest Apple flagship with A17 Pro chip, titanium design, and 48MP camera system.', price: 134900, originalPrice: 149900, category: 'Electronics', brand: 'Apple', images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'], stock: 50, ratings: 4.8, numReviews: 245, isFeatured: true, discount: 10, tags: ['smartphone', 'apple', '5g'] },
  { name: 'Samsung Galaxy S24 Ultra', description: 'Samsung\'s best with S Pen, 200MP camera, and AI features.', price: 124999, originalPrice: 134999, category: 'Electronics', brand: 'Samsung', images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'], stock: 35, ratings: 4.7, numReviews: 189, isFeatured: true, discount: 7, tags: ['smartphone', 'samsung', 's-pen'] },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation with 30-hour battery life.', price: 24990, originalPrice: 29990, category: 'Electronics', brand: 'Sony', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'], stock: 80, ratings: 4.9, numReviews: 412, isFeatured: true, discount: 17, tags: ['headphones', 'wireless', 'noise-cancelling'] },
  { name: 'MacBook Air M3', description: '15-inch MacBook Air with M3 chip, 18-hour battery, and Liquid Retina display.', price: 134900, originalPrice: 139900, category: 'Electronics', brand: 'Apple', images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'], stock: 25, ratings: 4.9, numReviews: 156, isFeatured: true, discount: 4, tags: ['laptop', 'apple', 'm3'] },
  { name: 'Nike Air Max 270', description: 'Iconic Air Max cushioning with modern design for all-day comfort.', price: 12995, originalPrice: 14995, category: 'Clothing', brand: 'Nike', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], stock: 120, ratings: 4.5, numReviews: 678, isFeatured: true, discount: 13, tags: ['shoes', 'nike', 'running'] },
  { name: 'Levi\'s 511 Slim Jeans', description: 'Classic slim fit jeans with stretch fabric for comfort and style.', price: 3499, originalPrice: 4999, category: 'Clothing', brand: 'Levi\'s', images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'], stock: 200, ratings: 4.3, numReviews: 892, isFeatured: false, discount: 30, tags: ['jeans', 'denim', 'slim-fit'] },
  { name: 'Clean Code by Robert Martin', description: 'A handbook of agile software craftsmanship. Essential for every developer.', price: 699, originalPrice: 999, category: 'Books', brand: 'Pearson', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500'], stock: 150, ratings: 4.8, numReviews: 1205, isFeatured: false, discount: 30, tags: ['programming', 'software', 'coding'] },
  { name: 'Instant Pot Duo 7-in-1', description: 'Multi-use pressure cooker, slow cooker, rice cooker, steamer, and more.', price: 8999, originalPrice: 11999, category: 'Home & Kitchen', brand: 'Instant Pot', images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'], stock: 60, ratings: 4.6, numReviews: 2341, isFeatured: true, discount: 25, tags: ['kitchen', 'cooking', 'pressure-cooker'] },
  { name: 'Yoga Mat Premium', description: 'Non-slip 6mm thick yoga mat with alignment lines and carrying strap.', price: 1299, originalPrice: 1999, category: 'Sports', brand: 'Liforme', images: ['https://images.unsplash.com/photo-1601925228008-f5e4c5e5e5e5?w=500'], stock: 300, ratings: 4.4, numReviews: 567, isFeatured: false, discount: 35, tags: ['yoga', 'fitness', 'exercise'] },
  { name: 'L\'Oreal Revitalift Serum', description: 'Anti-aging face serum with 1.5% pure hyaluronic acid for plump skin.', price: 1299, originalPrice: 1699, category: 'Beauty', brand: 'L\'Oreal', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'], stock: 180, ratings: 4.2, numReviews: 445, isFeatured: false, discount: 24, tags: ['skincare', 'serum', 'anti-aging'] },
  { name: 'LEGO Technic Bugatti', description: 'Detailed 1:8 scale Bugatti Chiron with working gearbox and W16 engine.', price: 14999, originalPrice: 17999, category: 'Toys', brand: 'LEGO', images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'], stock: 40, ratings: 4.9, numReviews: 234, isFeatured: true, discount: 17, tags: ['lego', 'technic', 'building'] },
  { name: 'iPad Pro 12.9" M4', description: 'Ultra-thin iPad Pro with M4 chip, OLED display, and Apple Pencil Pro support.', price: 109900, originalPrice: 119900, category: 'Electronics', brand: 'Apple', images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'], stock: 30, ratings: 4.8, numReviews: 178, isFeatured: true, discount: 8, tags: ['tablet', 'apple', 'ipad'] },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.insertMany(products);

    const adminExists = await User.findOne({ email: 'admin@shopzone.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin User', email: 'admin@shopzone.com', password: 'Admin@123', role: 'admin' });
    }
    const userExists = await User.findOne({ email: 'user@shopzone.com' });
    if (!userExists) {
      await User.create({ name: 'Test User', email: 'user@shopzone.com', password: 'User@123', role: 'user' });
    }

    console.log('✅ Database seeded successfully!');
    console.log('Admin: admin@shopzone.com / Admin@123');
    console.log('User:  user@shopzone.com / User@123');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
