# ShopZone — Viva Questions & Answers

## 📌 Project Overview Questions

**Q1. What is the title of your project?**
A: "Online Shopping Website with Cypress Automation Testing" — a full-stack MERN ecommerce application with comprehensive automated testing using Cypress.

**Q2. What problem does your project solve?**
A: It demonstrates a complete, production-ready ecommerce solution covering the entire software development lifecycle — from requirements to deployment — with automated testing ensuring quality and reliability.

**Q3. What is the MERN stack?**
A: MERN stands for MongoDB (database), Express.js (backend framework), React.js (frontend library), and Node.js (runtime environment). It's a full JavaScript stack for building web applications.

---

## 🔐 Authentication Questions

**Q4. What is JWT? How does it work?**
A: JWT (JSON Web Token) is a compact, URL-safe token for securely transmitting information. It has three parts: Header (algorithm), Payload (user data), and Signature (verification). The server signs the token with a secret key; the client sends it in the Authorization header for protected routes.

**Q5. What is the difference between authentication and authorization?**
A: Authentication verifies *who you are* (login). Authorization determines *what you can do* (admin vs user permissions).

**Q6. How are passwords stored securely?**
A: Passwords are hashed using bcryptjs with a salt factor of 12 before storing in MongoDB. Plain text passwords are never stored.

**Q7. What are protected routes?**
A: Routes that require authentication. In React, a ProtectedRoute component checks if a JWT token exists; if not, it redirects to the login page using React Router's Navigate component.

---

## ⚛️ React Questions

**Q8. What is Context API? Why did you use it?**
A: Context API is React's built-in state management solution. I used it for AuthContext (user state), CartContext (cart state), and ThemeContext (dark mode) to avoid prop drilling across components.

**Q9. What are React Hooks? Which ones did you use?**
A: Hooks let you use state and lifecycle features in functional components. I used: useState (local state), useEffect (side effects/API calls), useContext (consuming context), useCallback (memoizing functions), useRef (DOM references), useNavigate, useParams, useSearchParams (routing).

**Q10. What is the difference between useEffect and useCallback?**
A: useEffect runs side effects after render (API calls, subscriptions). useCallback memoizes a function reference to prevent unnecessary re-renders when passed as props.

**Q11. How does React Router work?**
A: React Router v6 uses a BrowserRouter with Routes and Route components to map URL paths to components. It uses the HTML5 History API for navigation without page reloads.

---

## 🗄️ Database Questions

**Q12. Why MongoDB over SQL databases?**
A: MongoDB is schema-flexible (good for evolving product catalogs), stores JSON-like documents (natural fit for JavaScript), scales horizontally, and handles nested data (product reviews, order items) naturally.

**Q13. What is Mongoose? What are schemas?**
A: Mongoose is an ODM (Object Document Mapper) for MongoDB. Schemas define the structure, data types, validations, and methods for documents. They provide structure to MongoDB's flexible documents.

**Q14. What is indexing in MongoDB? Where did you use it?**
A: Indexes improve query performance. I used a text index on Product's name, description, and brand fields to enable full-text search functionality.

**Q15. Explain the database collections in your project.**
A: Users (auth + profile), Products (catalog with embedded reviews), Cart (per-user with items array), Wishlist (per-user product references), Orders (complete order with shipping, payment, status).

---

## 🧪 Cypress Testing Questions

**Q16. What is Cypress? How is it different from Selenium?**
A: Cypress is a modern JavaScript E2E testing framework that runs directly in the browser. Unlike Selenium (which uses WebDriver), Cypress has direct DOM access, automatic waiting, time-travel debugging, and is faster and more reliable.

**Q17. What types of tests did you write?**
A: 
- **E2E Tests**: Full user flows (login → add to cart → checkout → order)
- **API Tests**: REST endpoint testing with request/response validation
- **UI Tests**: Navigation, dark mode, responsive design
- **Component Tests**: Form validation, cart operations

**Q18. What are Cypress custom commands? Give an example.**
A: Custom commands extend Cypress with reusable functions. Example: `cy.login(email, password)` encapsulates the login flow so tests don't repeat the same steps. Defined in `support/commands.js`.

**Q19. What are Cypress fixtures?**
A: Fixtures are static JSON files containing test data (users.json, products.json). They separate test data from test logic, making tests maintainable and reusable.

**Q20. What are Cypress hooks?**
A: `before()` runs once before all tests, `beforeEach()` runs before each test, `after()` and `afterEach()` run after. Used for setup (login, seed data) and teardown (clear cart).

**Q21. How do you handle test failures in Cypress?**
A: Cypress automatically takes screenshots on failure (configured in cypress.config.js). Video recording captures the entire test run. Mochawesome generates detailed HTML reports with pass/fail status.

**Q22. What is the difference between cy.get() and cy.find()?**
A: `cy.get()` queries from the document root. `cy.find()` queries within a previously selected element (scoped search). Example: `cy.get('[data-cy=cart-item]').find('[data-cy=remove-btn]')`.

**Q23. What are data-cy attributes? Why use them?**
A: Custom HTML attributes (data-cy="element-name") used exclusively for testing. They decouple tests from CSS classes/IDs that might change during styling, making tests more stable.

**Q24. What is cy.session()? Why is it useful?**
A: cy.session() caches and restores browser session state (cookies, localStorage) between tests. It avoids repeating the login flow for every test, making the test suite significantly faster.

---

## 🌐 REST API Questions

**Q25. What are REST API principles?**
A: REST (Representational State Transfer) principles: Stateless, Client-Server, Uniform Interface (HTTP methods), Resource-based URLs, Cacheable, Layered System.

**Q26. Explain HTTP methods used in your project.**
A: GET (retrieve data), POST (create), PUT (update), DELETE (remove). Example: GET /products (list), POST /cart (add item), PUT /cart/:id (update qty), DELETE /cart/:id (remove).

**Q27. What are HTTP status codes? Give examples from your project.**
A: 200 (OK), 201 (Created - new user/order), 400 (Bad Request - validation error), 401 (Unauthorized - no token), 403 (Forbidden - non-admin), 404 (Not Found - product), 500 (Server Error).

**Q28. What is middleware in Express.js?**
A: Functions that execute between request and response. My auth middleware verifies JWT tokens and attaches the user to req.user. The admin middleware checks if the user has admin role.

---

## 🏗️ Architecture Questions

**Q29. Explain the MVC pattern in your backend.**
A: Models (Mongoose schemas - data layer), Controllers (business logic - cartController, orderController), Routes (URL mapping - Express Router). Views are handled by React frontend.

**Q30. What is CORS? Why is it needed?**
A: Cross-Origin Resource Sharing. Browsers block requests from different origins (localhost:3000 to localhost:5000). The cors npm package configures the backend to accept requests from the React frontend.

**Q31. How does the cart work across sessions?**
A: Cart is stored in MongoDB (not localStorage), linked to the user's ID. When a user logs in, the cart is fetched from the database, ensuring persistence across devices and sessions.

**Q32. How did you implement dark mode?**
A: ThemeContext stores the dark mode state. Toggling adds/removes the 'dark' class on the HTML element. CSS variables (--bg, --text, --border) change values under the .dark selector, updating all components instantly.

---

## 🚀 Deployment Questions

**Q33. How would you deploy this project?**
A: Frontend → Vercel or Netlify (static hosting). Backend → Railway, Render, or AWS EC2. Database → MongoDB Atlas (cloud). Environment variables configured on each platform.

**Q34. What is .env file? Why shouldn't it be committed to Git?**
A: .env stores sensitive configuration (DB URI, JWT secret, API keys). It should be in .gitignore because exposing secrets in version control is a security vulnerability.

**Q35. What improvements would you make with more time?**
A: Real payment gateway (Razorpay), email notifications (Nodemailer), Redis caching, image upload (Cloudinary), real-time order updates (Socket.io), PWA support, CI/CD pipeline with GitHub Actions.
