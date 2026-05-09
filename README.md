# 🛒 ShopZone: Advanced E-Commerce Ecosystem with Full-Stack Automation

ShopZone is an industry-grade, full-stack E-commerce platform built using the **MERN (MongoDB, Express, React, Node.js)** stack. This project is engineered with a primary focus on **Software Quality Assurance (SQA)**, featuring a comprehensive automation suite of **110+ test cases** using **Cypress**.

---

## 🏗️ Project Architecture

The application follows a **Decoupled Architecture**:
- **Backend**: A RESTful API built with Node.js and Express, utilizing MongoDB for persistent storage and JWT for stateless authentication.
- **Frontend**: A dynamic Single Page Application (SPA) built with React.js, utilizing the Context API for state management and Framer Motion for premium UI animations.
- **Testing Layer**: An independent automation framework using Cypress that validates both the UI (E2E) and the Backend (API).

---

## 🌟 Core Features

### 👤 User Management & Security
- **JWT Authentication**: Secure login and registration with token-based session management.
- **Profile Persistence**: User data and preferences (like Dark Mode) persist across sessions using LocalStorage.
- **Protected Routes**: Strict access control preventing unauthorized users from accessing Checkout, Orders, or Admin panels.

### 🛍️ E-Commerce Engine
- **Intelligent Catalog**: Real-time product search, category-based filtering, and dynamic price sorting.
- **Smart Cart & Wishlist**: Real-time quantity updates and persistence logic to ensure a seamless shopping experience.
- **Recommendations**: An integrated recommendation engine based on product categories and ratings.

### 🛡️ Admin Dashboard (CRUD)
- **Inventory Control**: Full capability to Add, Update, and Delete products.
- **User Analytics**: View and manage user accounts and roles.
- **Order Tracking**: Management interface to track sales and update shipping statuses.

---

## 🧪 Testing & Quality Assurance (Cypress)

The standout feature of ShopZone is its **Automation Suite**, which ensures 100% reliability of the core business logic.

### 📁 Test Suites Overview
1. **Authentication (`01_auth.cy.js`)**: Validates every edge case of the login/register flow, including field validation and session persistence.
2. **Product Exploration (`02_products.cy.js`)**: Ensures search accuracy and the integrity of the filtering system.
3. **Cart Logic (`03_cart.cy.js`)**: Tests the mathematical accuracy of price totals and real-time state updates.
4. **Checkout Flow (`04_checkout.cy.js`)**: A multi-step validation of the shipping address form and payment processing.
5. **API Performance (`05_api.cy.js`)**: Independent testing of REST endpoints to verify response times, status codes, and JSON structures.
6. **UI & Responsiveness (`06_ui.cy.js`)**: Validates the visual integrity across Mobile, Tablet, and Desktop resolutions.

### 🛠️ Advanced Automation Features
- **Headless Execution**: Integrated for CI/CD pipelines.
- **Automated Artifacts**: Failure-triggered screenshots and full MP4 video recordings for audit trails.
- **Custom Commands**: Optimized testing using API-level bypasses for faster test execution.

---

## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (v18), Context API, Axios, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Testing** | Cypress (v13+), Mochawesome Reporting |
| **Security** | JWT (JSON Web Tokens), Bcrypt Password Hashing |

---

## 📂 Project Structure

```text
ShopZone/
├── backend/            # Express API, Controllers, Models, Routes
├── frontend/           # React Components, Context, Pages, Styles
├── cypress/            # E2E & API Automation Test Suites
│   ├── e2e/            # Test Specifications (.cy.js)
│   ├── fixtures/       # Mock Data (Users, Products)
│   └── support/        # Custom Commands & Configurations
├── screenshots/        # Auto-generated failure snapshots
├── videos/             # Full test run recordings
└── setup.sh            # Automation script for environment setup
