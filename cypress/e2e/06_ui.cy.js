/// <reference types="cypress" />

describe('UI & Navigation Tests', () => {
  context('Navbar', () => {
    it('should display navbar on all pages', () => {
      cy.visit('/');
      cy.get('[data-cy=navbar]').should('be.visible');
      cy.get('[data-cy=brand-logo]').should('contain', 'ShopZone');
    });

    it('should navigate to home when brand logo clicked', () => {
      cy.visit('/products');
      cy.get('[data-cy=brand-logo]').click();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });

    it('should show login button when not authenticated', () => {
      cy.visit('/');
      cy.get('[data-cy=login-btn]').should('be.visible');
    });

    it('should show user menu when authenticated', () => {
      cy.loginByApi(Cypress.env('userEmail'), Cypress.env('userPassword'));
      cy.visit('/');
      cy.get('[data-cy=user-menu]').should('be.visible');
    });

    it('should show cart icon in navbar', () => {
      cy.visit('/');
      cy.get('[data-cy=cart-icon]').should('be.visible');
    });

    it('should navigate to cart when cart icon clicked', () => {
      cy.visit('/');
      cy.get('[data-cy=cart-icon]').click();
      cy.url().should('include', '/cart');
    });
  });

  context('Dark Mode', () => {
    it('should toggle dark mode', () => {
      cy.visit('/');
      cy.get('html').then(($html) => {
        const isDark = $html.hasClass('dark');
        cy.get('[data-cy=theme-toggle]').click();
        cy.get('html').should(isDark ? 'not.have.class' : 'have.class', 'dark');
      });
    });

    it('should persist dark mode preference', () => {
      cy.visit('/');
      cy.get('[data-cy=theme-toggle]').click();
      cy.reload();
      cy.get('html').should('have.class', 'dark');
      // Reset
      cy.get('[data-cy=theme-toggle]').click();
    });
  });

  context('Homepage', () => {
    it('should display hero section', () => {
      cy.visit('/');
      cy.get('[data-cy=home-page]').should('be.visible');
      cy.get('[data-cy=shop-now-btn]').should('be.visible');
    });

    it('should navigate to products from shop now button', () => {
      cy.visit('/');
      cy.get('[data-cy=shop-now-btn]').click();
      cy.url().should('include', '/products');
    });

    it('should display featured products on homepage', () => {
      cy.visit('/');
      cy.get('[data-cy=product-card]').should('have.length.greaterThan', 0);
    });

    it('should display category links', () => {
      cy.visit('/');
      cy.get('[data-cy=category-link]').should('have.length.greaterThan', 0);
    });
  });

  context('Responsive Design', () => {
    it('should be responsive on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('/');
      cy.get('[data-cy=navbar]').should('be.visible');
      cy.get('[data-cy=brand-logo]').should('be.visible');
    });

    it('should be responsive on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('/products');
      cy.get('[data-cy=products-page]').should('be.visible');
      cy.get('[data-cy=product-card]').should('have.length.greaterThan', 0);
    });

    it('should be responsive on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.visit('/');
      cy.get('[data-cy=home-page]').should('be.visible');
    });
  });

  context('Footer', () => {
    it('should display footer on homepage', () => {
      cy.visit('/');
      cy.scrollTo('bottom');
      cy.get('footer').should('be.visible');
    });

    it('should have working footer links', () => {
      cy.visit('/');
      cy.scrollTo('bottom');
      cy.get('footer').find('a').first().should('have.attr', 'href');
    });
  });

  context('404 Page', () => {
    it('should show 404 page for invalid routes', () => {
      cy.visit('/this-page-does-not-exist', { failOnStatusCode: false });
      cy.contains('404').should('be.visible');
    });
  });

  context('Admin Dashboard UI', () => {
    beforeEach(() => {
      cy.loginByApi(Cypress.env('adminEmail'), Cypress.env('adminPassword'));
    });

    it('should display admin dashboard', () => {
      cy.visit('/admin');
      cy.get('[data-cy=stat-totalUsers]').should('be.visible');
      cy.get('[data-cy=stat-totalProducts]').should('be.visible');
      cy.get('[data-cy=stat-totalOrders]').should('be.visible');
    });

    it('should display admin products page', () => {
      cy.visit('/admin/products');
      cy.get('[data-cy=add-product-btn]').should('be.visible');
      cy.get('[data-cy=product-row]').should('have.length.greaterThan', 0);
    });

    it('should open add product modal', () => {
      cy.visit('/admin/products');
      cy.get('[data-cy=add-product-btn]').click();
      cy.get('[data-cy=product-form]').should('be.visible');
    });

    it('should display admin orders page', () => {
      cy.visit('/admin/orders');
      cy.get('[data-cy=admin-order-row]').should('have.length.greaterThan', 0);
    });

    it('should display admin users page', () => {
      cy.visit('/admin/users');
      cy.get('[data-cy=user-row]').should('have.length.greaterThan', 0);
    });
  });

  context('Order Management UI', () => {
    beforeEach(() => {
      cy.loginByApi(Cypress.env('userEmail'), Cypress.env('userPassword'));
    });

    it('should display orders page', () => {
      cy.visit('/orders');
      cy.get('[data-cy=orders-page]').should('be.visible');
    });

    it('should display profile page', () => {
      cy.visit('/profile');
      cy.get('[data-cy=profile-page]').should('be.visible');
      cy.get('[data-cy=profile-form]').should('be.visible');
    });
  });
});
