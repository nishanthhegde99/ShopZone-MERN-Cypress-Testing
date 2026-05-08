/// <reference types="cypress" />

describe('Authentication Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  context('Login Page UI', () => {
    it('should display login form elements', () => {
      cy.get('[data-cy=login-page]').should('be.visible');
      cy.get('[data-cy=email-input]').should('be.visible');
      cy.get('[data-cy=password-input]').should('be.visible');
      cy.get('[data-cy=login-submit]').should('be.visible').and('contain', 'Sign In');
      cy.get('[data-cy=register-link]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('[data-cy=login-submit]').click();
      cy.get('[data-cy=email-error]').should('be.visible').and('contain', 'Email is required');
      cy.get('[data-cy=password-error]').should('be.visible').and('contain', 'Password is required');
    });

    it('should show error for invalid email format', () => {
      cy.get('[data-cy=email-input]').type('invalidemail');
      cy.get('[data-cy=login-submit]').click();
      cy.get('[data-cy=email-error]').should('contain', 'Invalid email');
    });
  });

  context('Valid Login', () => {
    it('should login successfully with valid credentials', () => {
      cy.fixture('users').then(({ validUser }) => {
        cy.get('[data-cy=email-input]').type(validUser.email);
        cy.get('[data-cy=password-input]').type(validUser.password);
        cy.get('[data-cy=login-submit]').click();
        cy.url().should('not.include', '/login');
        cy.get('[data-cy=user-menu]').should('be.visible');
      });
    });

    it('should login as admin and redirect to admin panel', () => {
      cy.get('[data-cy=email-input]').type(Cypress.env('adminEmail'));
      cy.get('[data-cy=password-input]').type(Cypress.env('adminPassword'));
      cy.get('[data-cy=login-submit]').click();
      cy.url().should('include', '/admin');
    });
  });

  context('Invalid Login', () => {
    it('should show error for wrong credentials', () => {
      cy.fixture('users').then(({ invalidUser }) => {
        cy.get('[data-cy=email-input]').type(invalidUser.email);
        cy.get('[data-cy=password-input]').type(invalidUser.password);
        cy.get('[data-cy=login-submit]').click();
        cy.url().should('include', '/login');
      });
    });

    it('should show error for correct email but wrong password', () => {
      cy.get('[data-cy=email-input]').type(Cypress.env('userEmail'));
      cy.get('[data-cy=password-input]').type('wrongpassword123');
      cy.get('[data-cy=login-submit]').click();
      cy.url().should('include', '/login');
    });
  });

  context('Registration', () => {
    it('should navigate to register page', () => {
      cy.get('[data-cy=register-link]').click();
      cy.url().should('include', '/register');
      cy.get('[data-cy=register-page]').should('be.visible');
    });

    it('should show validation errors on empty registration form', () => {
      cy.visit('/register');
      cy.get('[data-cy=register-submit]').click();
      cy.get('[data-cy=name-error]').should('be.visible');
      cy.get('[data-cy=email-error]').should('be.visible');
      cy.get('[data-cy=password-error]').should('be.visible');
    });

    it('should show error when passwords do not match', () => {
      cy.visit('/register');
      cy.get('[data-cy=name-input]').type('Test User');
      cy.get('[data-cy=email-input]').type('test@example.com');
      cy.get('[data-cy=password-input]').type('Test@123');
      cy.get('[data-cy=confirmPassword-input]').type('Different@123');
      cy.get('[data-cy=register-submit]').click();
      cy.get('[data-cy=confirmPassword-error]').should('contain', 'do not match');
    });

    it('should show error for short password', () => {
      cy.visit('/register');
      cy.get('[data-cy=password-input]').type('123');
      cy.get('[data-cy=register-submit]').click();
      cy.get('[data-cy=password-error]').should('contain', 'Minimum 6');
    });
  });

  context('Logout', () => {
    it('should logout successfully', () => {
      cy.login(Cypress.env('userEmail'), Cypress.env('userPassword'));
      cy.visit('/');
      cy.get('[data-cy=user-menu]').click();
      cy.get('[data-cy=logout-btn]').click();
      cy.get('[data-cy=login-btn]').should('be.visible');
    });
  });

  context('Forgot Password', () => {
    it('should display forgot password form', () => {
      cy.visit('/forgot-password');
      cy.get('[data-cy=forgot-password-page]').should('be.visible');
      cy.get('[data-cy=email-input]').should('be.visible');
      cy.get('[data-cy=submit-btn]').should('be.visible');
    });

    it('should submit forgot password form', () => {
      cy.visit('/forgot-password');
      cy.get('[data-cy=email-input]').type(Cypress.env('userEmail'));
      cy.get('[data-cy=submit-btn]').click();
    });
  });

  context('Protected Routes', () => {
    it('should redirect unauthenticated user from protected route', () => {
      cy.visit('/orders');
      cy.url().should('include', '/login');
    });

    it('should redirect unauthenticated user from checkout', () => {
      cy.visit('/checkout');
      cy.url().should('include', '/login');
    });

    it('should redirect non-admin from admin panel', () => {
      cy.login(Cypress.env('userEmail'), Cypress.env('userPassword'));
      cy.visit('/admin');
      cy.url().should('not.include', '/admin');
    });
  });
});
