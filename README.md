# 🛍️ ShopZone — Online Shopping Website with Cypress Automation Testing

> **MCA Final Year Project** | Full-Stack Ecommerce with Complete Cypress Test Suite

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green)](https://mongodb.com)
[![Cypress](https://img.shields.io/badge/Cypress-13-brightgreen)](https://cypress.io)

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Cypress Testing](#cypress-testing)
- [API Documentation](#api-documentation)
- [Demo Credentials](#demo-credentials)
- [Modules](#modules)

---

## 🎯 Project Overview

ShopZone is a production-ready full-stack ecommerce platform built with the MERN stack. It features complete user authentication, product management, shopping cart, wishlist, checkout with payment integration, order tracking, and an admin dashboard — all tested with a comprehensive Cypress automation test suite.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6, Context API |
| Styling | Custom CSS3 with CSS Variables (Dark Mode) |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) |
| Testing | Cypress 13 (E2E + API) |
| Reports | Mochawesome HTML Reports |

---

## 📁 Project Structure

```
project/
├── frontend/                  # React.js Application
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/        # Navbar, Footer, ProtectedRoute
│       │   └── product/       # ProductCard
│       ├── context/           # AuthContext, CartContext, ThemeContext
│       ├── pages/             # All page components
│       │   └── admin/         # Admin dashboard pages
│       ├── styles/            # Global CSS
│       └── utils/             # API utility (axios)
│
├── backend/                   # Node.js + Express API
│   ├── controllers/           # Business logic
│   ├── models/                # Mongoose schemas
│   ├── routes/                # Express routes
│   ├── middleware/            # Auth middleware
│   └── utils/                 # DB seeder
│
├── cypress/                   # Cypress Test Suite
│   ├── e2e/
│   │   ├── 01_auth.cy.js      # Authentication tests
│   │   ├── 02_products.cy.js  # Product tests
│   │   ├── 03_cart.cy.js      # Cart tests
│   │   ├── 04_checkout.cy.js  # Checkout tests
│   │   ├── 05_api.cy.js       # API tests
│   │   └── 06_ui.cy.js        # UI & Navigation tests
│   ├── fixtures/              # Test data
│   └── support/               # Custom commands
│
├── screenshots/               # Test failure screenshots
├── videos/                    # Test execution videos
└── reports/                   # Mochawesome HTML reports
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

### Step 1: Clone & Navigate
```bash
cd project
```

### Step 2: Setup Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run seed        # Seed database with sample data
npm run dev         # Start backend on port 5000
```

### Step 3: Setup Frontend
```bash
cd frontend
npm install
npm start           # Start frontend on port 3000
```

### Step 4: Setup Cypress
```bash
cd cypress
npm install
```

---

## 🚀 Running the Application

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

Open: **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopzone.com | Admin@123 |
| User | user@shopzone.com | User@123 |

---

## 🧪 Cypress Testing

### Open Cypress Test Runner (Interactive)
```bash
cd cypress
npx cypress open
```

### Run All Tests (Headless)
```bash
cd cypress
npx cypress run
```

### Run Specific Test File
```bash
npx cypress run --spec "e2e/01_auth.cy.js"
```

### Generate HTML Report
```bash
npm run cy:report
```

### Test Files Overview

| File | Tests | Description |
|------|-------|-------------|
| `01_auth.cy.js` | 15+ | Login, Register, Logout, Protected Routes |
| `02_products.cy.js` | 15+ | Listing, Search, Filter, Detail Page |
| `03_cart.cy.js` | 12+ | Add, Remove, Update Quantity, Total |
| `04_checkout.cy.js` | 10+ | Address, Payment, Order Placement |
| `05_api.cy.js` | 25+ | All REST API endpoints |
| `06_ui.cy.js` | 20+ | Navigation, Dark Mode, Responsive, Admin |

**Total: 97+ automated test cases**

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

#### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get profile | Yes |
| PUT | `/auth/profile` | Update profile | Yes |
| POST | `/auth/forgot-password` | Forgot password | No |

#### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Get all products | No |
| GET | `/products/:id` | Get single product | No |
| GET | `/products/featured` | Featured products | No |
| GET | `/products/categories` | All categories | No |
| POST | `/products/:id/reviews` | Add review | Yes |

#### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/cart` | Get cart | Yes |
| POST | `/cart` | Add to cart | Yes |
| PUT | `/cart/:productId` | Update quantity | Yes |
| DELETE | `/cart/:productId` | Remove item | Yes |

#### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/orders` | Create order | Yes |
| GET | `/orders/my-orders` | My orders | Yes |
| GET | `/orders/:id` | Order detail | Yes |
| PUT | `/orders/:id/cancel` | Cancel order | Yes |

#### Admin (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Dashboard stats |
| GET | `/admin/users` | All users |
| GET | `/admin/orders` | All orders |
| PUT | `/admin/orders/:id/status` | Update order status |
| POST | `/admin/products` | Create product |
| PUT | `/admin/products/:id` | Update product |
| DELETE | `/admin/products/:id` | Delete product |

---

## 🗄️ Database Collections

- **Users** — Authentication, profile, address
- **Products** — Catalog with reviews, ratings
- **Cart** — Per-user cart with items
- **Wishlist** — Per-user wishlist
- **Orders** — Order history with tracking

---

## 🌟 Features

- ✅ JWT Authentication with protected routes
- ✅ Product search, filter, sort, pagination
- ✅ Shopping cart with real-time updates
- ✅ Wishlist management
- ✅ Multi-step checkout with 4 payment methods
- ✅ Order tracking with status timeline
- ✅ Admin dashboard with CRUD operations
- ✅ Dark mode with persistence
- ✅ Responsive mobile-friendly design
- ✅ AI-based product recommendations
- ✅ Product reviews and ratings
- ✅ 97+ Cypress automated tests
- ✅ Screenshot on failure + video recording
- ✅ Mochawesome HTML test reports

---

## 👨‍💻 Author

**MCA Final Year Project**  
Built with ❤️ using React, Node.js, MongoDB & Cypress
