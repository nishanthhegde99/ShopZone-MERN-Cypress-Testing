/// <reference types="cypress" />

describe('Product Tests', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  context('Product Listing', () => {
    it('should load products page', () => {
      cy.get('[data-cy=products-page]').should('be.visible');
      cy.get('[data-cy=product-card]').should('have.length.greaterThan', 0);
    });

    it('should display product details on card', () => {
      cy.get('[data-cy=product-card]').first().within(() => {
        cy.get('[data-cy=product-name]').should('be.visible');
        cy.get('[data-cy=product-price]').should('be.visible');
        cy.get('[data-cy=add-to-cart-btn]').should('be.visible');
      });
    });

    it('should show correct number of products', () => {
      cy.get('[data-cy=product-card]').should('have.length.at.least', 1);
    });
  });

  context('Search Functionality', () => {
    it('should search products by keyword', () => {
      cy.fixture('products').then(({ searchKeyword }) => {
        cy.visit('/');
        cy.get('[data-cy=search-input]').type(searchKeyword);
        cy.get('[data-cy=search-input]').type('{enter}');
        cy.url().should('include', `keyword=${searchKeyword}`);
        cy.get('[data-cy=products-page]').should('be.visible');
      });
    });

    it('should show no results for invalid search', () => {
      cy.visit('/products?keyword=xyznonexistentproduct123');
      cy.get('[data-cy=product-card]').should('have.length', 0);
    });

    it('should clear search and show all products', () => {
      cy.visit('/products?keyword=iPhone');
      cy.get('[data-cy=product-card]').then((results) => {
        const filteredCount = results.length;
        cy.visit('/products');
        cy.get('[data-cy=product-card]').should('have.length.greaterThan', filteredCount - 1);
      });
    });
  });

  context('Filter Functionality', () => {
    it('should filter products by category', () => {
      cy.fixture('products').then(({ filterCategory }) => {
        cy.visit(`/products?category=${filterCategory}`);
        cy.get('[data-cy=product-card]').should('have.length.greaterThan', 0);
      });
    });

    it('should open filter sidebar', () => {
      cy.get('[data-cy=filter-toggle]').click();
      cy.get('[data-cy=filters-sidebar]').should('be.visible');
    });

    it('should filter by category from sidebar', () => {
      cy.get('[data-cy=filter-toggle]').click();
      cy.get('[data-cy=category-Electronics]').click();
      cy.url().should('include', 'category=Electronics');
    });

    it('should sort products by price ascending', () => {
      cy.get('[data-cy=sort-select]').select('price_asc');
      cy.url().should('include', 'sort=price_asc');
      cy.get('[data-cy=product-card]').should('have.length.greaterThan', 0);
    });

    it('should sort products by price descending', () => {
      cy.get('[data-cy=sort-select]').select('price_desc');
      cy.get('[data-cy=product-card]').should('have.length.greaterThan', 0);
    });

    it('should filter by price range', () => {
      cy.get('[data-cy=filter-toggle]').click();
      cy.get('[data-cy=min-price]').type('1000');
      cy.get('[data-cy=max-price]').type('50000');
      cy.get('[data-cy=product-card]').should('have.length.greaterThan', 0);
    });
  });

  context('Product Detail Page', () => {
    it('should navigate to product detail page', () => {
      cy.get('[data-cy=product-card]').first().click();
      cy.get('[data-cy=product-detail-page]').should('be.visible');
      cy.url().should('include', '/products/');
    });

    it('should display product information', () => {
      cy.get('[data-cy=product-card]').first().click();
      cy.get('[data-cy=product-title]').should('be.visible');
      cy.get('[data-cy=product-price]').should('be.visible');
      cy.get('[data-cy=product-image]').should('be.visible');
      cy.get('[data-cy=add-to-cart-btn]').should('be.visible');
    });

    it('should update quantity on product detail page', () => {
      cy.get('[data-cy=product-card]').first().click();
      cy.get('[data-cy=quantity]').should('contain', '1');
      cy.contains('button', '+').click();
      cy.get('[data-cy=quantity]').should('contain', '2');
      cy.contains('button', '−').click();
      cy.get('[data-cy=quantity]').should('contain', '1');
    });

    it('should show recommendations on product detail page', () => {
      cy.get('[data-cy=product-card]').first().click();
      cy.get('[data-cy=product-detail-page]').should('be.visible');
    });
  });

  context('Category Navigation', () => {
    it('should navigate to category from homepage', () => {
      cy.visit('/');
      cy.get('[data-cy=category-link]').first().click();
      cy.url().should('include', 'category=');
      cy.get('[data-cy=products-page]').should('be.visible');
    });
  });
});
