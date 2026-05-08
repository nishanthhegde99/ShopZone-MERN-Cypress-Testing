/// <reference types="cypress" />

describe('API Tests', () => {
  const apiUrl = Cypress.env('apiUrl');
  let authToken;
  let adminToken;
  let createdProductId;

  before(() => {
    // Get user token
    cy.request('POST', `${apiUrl}/auth/login`, {
      email: Cypress.env('userEmail'),
      password: Cypress.env('userPassword'),
    }).then(({ body }) => { authToken = body.token; });

    // Get admin token
    cy.request('POST', `${apiUrl}/auth/login`, {
      email: Cypress.env('adminEmail'),
      password: Cypress.env('adminPassword'),
    }).then(({ body }) => { adminToken = body.token; });
  });

  context('Health Check', () => {
    it('GET /api/health - should return 200', () => {
      cy.request('GET', `${Cypress.config('baseUrl').replace(':3000', ':5001')}/api/health`).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.status).to.eq('OK');
      });
    });
  });

  context('Auth API', () => {
    it('POST /auth/register - should register new user', () => {
      const timestamp = Date.now();
      cy.request('POST', `${apiUrl}/auth/register`, {
        name: 'API Test User',
        email: `apitest_${timestamp}@test.com`,
        password: 'Test@123',
      }).then(({ status, body }) => {
        expect(status).to.eq(201);
        expect(body.success).to.be.true;
        expect(body.token).to.exist;
        expect(body.user.email).to.include('apitest_');
      });
    });

    it('POST /auth/login - should login with valid credentials', () => {
      cy.request('POST', `${apiUrl}/auth/login`, {
        email: Cypress.env('userEmail'),
        password: Cypress.env('userPassword'),
      }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.success).to.be.true;
        expect(body.token).to.be.a('string');
        expect(body.user).to.have.property('email');
      });
    });

    it('POST /auth/login - should return 401 for invalid credentials', () => {
      cy.request({ method: 'POST', url: `${apiUrl}/auth/login`, body: { email: 'wrong@test.com', password: 'wrong' }, failOnStatusCode: false })
        .then(({ status, body }) => {
          expect(status).to.eq(401);
          expect(body.success).to.be.false;
        });
    });

    it('GET /auth/me - should return user profile with valid token', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/auth/me`, headers: { Authorization: `Bearer ${authToken}` } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.success).to.be.true;
          expect(body.user).to.have.property('email');
        });
    });

    it('GET /auth/me - should return 401 without token', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/auth/me`, failOnStatusCode: false })
        .then(({ status }) => { expect(status).to.eq(401); });
    });
  });

  context('Products API', () => {
    it('GET /products - should return products list', () => {
      cy.request('GET', `${apiUrl}/products`).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.success).to.be.true;
        expect(body.products).to.be.an('array');
        expect(body.total).to.be.a('number');
      });
    });

    it('GET /products?category=Electronics - should filter by category', () => {
      cy.request('GET', `${apiUrl}/products?category=Electronics`).then(({ status, body }) => {
        expect(status).to.eq(200);
        body.products.forEach((p) => expect(p.category).to.eq('Electronics'));
      });
    });

    it('GET /products?keyword=iPhone - should search products', () => {
      cy.request('GET', `${apiUrl}/products?keyword=iPhone`).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.products).to.be.an('array');
      });
    });

    it('GET /products/featured - should return featured products', () => {
      cy.request('GET', `${apiUrl}/products/featured`).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.products).to.be.an('array');
      });
    });

    it('GET /products/categories - should return categories', () => {
      cy.request('GET', `${apiUrl}/products/categories`).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.categories).to.be.an('array').and.have.length.greaterThan(0);
      });
    });

    it('GET /products/:id - should return single product', () => {
      cy.request('GET', `${apiUrl}/products`).then(({ body }) => {
        const productId = body.products[0]._id;
        cy.request('GET', `${apiUrl}/products/${productId}`).then(({ status, body: pd }) => {
          expect(status).to.eq(200);
          expect(pd.product._id).to.eq(productId);
          expect(pd.product).to.have.property('name');
          expect(pd.product).to.have.property('price');
        });
      });
    });

    it('GET /products/:id - should return 404 for invalid ID', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/products/000000000000000000000000`, failOnStatusCode: false })
        .then(({ status }) => { expect(status).to.eq(404); });
    });
  });

  context('Cart API', () => {
    let productId;

    before(() => {
      cy.request('GET', `${apiUrl}/products?limit=1`).then(({ body }) => { productId = body.products[0]._id; });
    });

    it('GET /cart - should return cart for authenticated user', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/cart`, headers: { Authorization: `Bearer ${authToken}` } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.success).to.be.true;
          expect(body.cart).to.have.property('items');
        });
    });

    it('POST /cart - should add item to cart', () => {
      cy.request({ method: 'DELETE', url: `${apiUrl}/cart`, headers: { Authorization: `Bearer ${authToken}` }, failOnStatusCode: false });
      cy.request({ method: 'POST', url: `${apiUrl}/cart`, headers: { Authorization: `Bearer ${authToken}` }, body: { productId, quantity: 1 } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.success).to.be.true;
          expect(body.cart.items).to.have.length.greaterThan(0);
        });
    });

    it('PUT /cart/:productId - should update cart item quantity', () => {
      cy.request({ method: 'PUT', url: `${apiUrl}/cart/${productId}`, headers: { Authorization: `Bearer ${authToken}` }, body: { quantity: 3 } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          const item = body.cart.items.find((i) => i.product._id === productId || i.product === productId);
          expect(item?.quantity).to.eq(3);
        });
    });

    it('DELETE /cart/:productId - should remove item from cart', () => {
      cy.request({ method: 'DELETE', url: `${apiUrl}/cart/${productId}`, headers: { Authorization: `Bearer ${authToken}` } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.success).to.be.true;
        });
    });

    it('GET /cart - should return 401 without token', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/cart`, failOnStatusCode: false })
        .then(({ status }) => { expect(status).to.eq(401); });
    });
  });

  context('Orders API', () => {
    it('GET /orders/my-orders - should return user orders', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/orders/my-orders`, headers: { Authorization: `Bearer ${authToken}` } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.success).to.be.true;
          expect(body.orders).to.be.an('array');
        });
    });

    it('GET /orders/my-orders - should return 401 without token', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/orders/my-orders`, failOnStatusCode: false })
        .then(({ status }) => { expect(status).to.eq(401); });
    });
  });

  context('Admin API', () => {
    it('GET /admin/dashboard - should return stats for admin', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/admin/dashboard`, headers: { Authorization: `Bearer ${adminToken}` } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.stats).to.have.property('totalUsers');
          expect(body.stats).to.have.property('totalProducts');
          expect(body.stats).to.have.property('totalOrders');
        });
    });

    it('GET /admin/dashboard - should return 403 for non-admin', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/admin/dashboard`, headers: { Authorization: `Bearer ${authToken}` }, failOnStatusCode: false })
        .then(({ status }) => { expect(status).to.eq(403); });
    });

    it('POST /admin/products - should create product as admin', () => {
      cy.fixture('products').then(({ sampleProduct }) => {
        cy.request({ method: 'POST', url: `${apiUrl}/admin/products`, headers: { Authorization: `Bearer ${adminToken}` }, body: sampleProduct })
          .then(({ status, body }) => {
            expect(status).to.eq(201);
            expect(body.success).to.be.true;
            expect(body.product.name).to.eq(sampleProduct.name);
            createdProductId = body.product._id;
          });
      });
    });

    it('PUT /admin/products/:id - should update product as admin', () => {
      if (!createdProductId) return;
      cy.request({ method: 'PUT', url: `${apiUrl}/admin/products/${createdProductId}`, headers: { Authorization: `Bearer ${adminToken}` }, body: { price: 1299 } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.product.price).to.eq(1299);
        });
    });

    it('DELETE /admin/products/:id - should delete product as admin', () => {
      if (!createdProductId) return;
      cy.request({ method: 'DELETE', url: `${apiUrl}/admin/products/${createdProductId}`, headers: { Authorization: `Bearer ${adminToken}` } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.success).to.be.true;
        });
    });

    it('GET /admin/users - should return all users for admin', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/admin/users`, headers: { Authorization: `Bearer ${adminToken}` } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.users).to.be.an('array').and.have.length.greaterThan(0);
        });
    });
  });

  context('Wishlist API', () => {
    let productId;

    before(() => {
      cy.request('GET', `${apiUrl}/products?limit=1`).then(({ body }) => { productId = body.products[0]._id; });
    });

    it('GET /wishlist - should return wishlist', () => {
      cy.request({ method: 'GET', url: `${apiUrl}/wishlist`, headers: { Authorization: `Bearer ${authToken}` } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.wishlist).to.have.property('products');
        });
    });

    it('POST /wishlist/toggle - should toggle product in wishlist', () => {
      cy.request({ method: 'POST', url: `${apiUrl}/wishlist/toggle`, headers: { Authorization: `Bearer ${authToken}` }, body: { productId } })
        .then(({ status, body }) => {
          expect(status).to.eq(200);
          expect(body.success).to.be.true;
          expect(body.message).to.be.a('string');
        });
    });
  });
});
