import './commands';

// Global before each
beforeEach(() => {
  cy.window().then((win) => {
    // Preserve localStorage between tests in same spec
  });
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err) => {
  // Ignore React hydration errors in tests
  if (err.message.includes('ResizeObserver') || err.message.includes('hydrat')) return false;
});
