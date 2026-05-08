#!/bin/bash
# ShopZone Quick Setup Script

echo "🛍️  Setting up ShopZone..."

# Backend
echo "📦 Installing backend dependencies..."
cd backend && npm install

echo "🌱 Seeding database..."
npm run seed

echo ""
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install

echo ""
echo "📦 Installing Cypress dependencies..."
cd ../cypress && npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm start"
echo ""
echo "🧪 To run Cypress tests:"
echo "   cd cypress && npx cypress open"
echo ""
echo "🔑 Demo Credentials:"
echo "   Admin: admin@shopzone.com / Admin@123"
echo "   User:  user@shopzone.com / User@123"
