// Custom Cypress Commands for ShopZone

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-cy=email-input]').clear().type(email);
    cy.get('[data-cy=password-input]').clear().type(password);
    cy.get('[data-cy=login-submit]').click();
    cy.url().should('not.include', '/login');
  });
});

// Login via API (faster)
Cypress.Commands.add('loginByApi', (email, password) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, { email, password }).then(({ body }) => {
    localStorage.setItem('token', body.token);
    localStorage.setItem('user', JSON.stringify(body.user));
  });
});

// Add product to cart via API
Cypress.Commands.add('addToCartByApi', (productId, quantity = 1) => {
  const token = localStorage.getItem('token');
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/cart`,
    headers: { Authorization: `Bearer ${token}` },
    body: { productId, quantity },
  });
});

// Get first product ID
Cypress.Commands.add('getFirstProductId', () => {
  return cy.request(`${Cypress.env('apiUrl')}/products?limit=1`).then(({ body }) => body.products[0]?._id);
});

// Clear cart via API
Cypress.Commands.add('clearCartByApi', () => {
  const token = localStorage.getItem('token');
  if (token) {
    cy.request({ method: 'DELETE', url: `${Cypress.env('apiUrl')}/cart`, headers: { Authorization: `Bearer ${token}` }, failOnStatusCode: false });
  }
});

// Check if element is in viewport
Cypress.Commands.add('isInViewport', { prevSubject: true }, (subject) => {
  const bottom = Cypress.$(cy.state('window')).height();
  const rect = subject[0].getBoundingClientRect();
  expect(rect.top).to.be.lessThan(bottom);
  expect(rect.bottom).to.be.greaterThan(0);
  return subject;
});
