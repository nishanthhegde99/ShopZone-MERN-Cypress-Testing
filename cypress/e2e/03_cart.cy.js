/// <reference types="cypress" />

describe('Cart Tests', () => {
  beforeEach(() => {
    cy.loginByApi(Cypress.env('userEmail'), Cypress.env('userPassword'));
    cy.clearCartByApi();
  });

  context('Add to Cart', () => {
    it('should add product to cart from product listing', () => {
      cy.visit('/products');
      cy.get('[data-cy=add-to-cart-btn]').first().click();
      cy.get('[data-cy=cart-count]').should('be.visible').and('contain', '1');
    });

    it('should add product to cart from product detail page', () => {
      cy.visit('/products');
      cy.get('[data-cy=product-card]').first().click();
      cy.get('[data-cy=add-to-cart-btn]').first().click();
      cy.get('[data-cy=cart-count]').should('be.visible');
    });

    it('should show cart count in navbar after adding', () => {
      cy.visit('/products');
      cy.get('[data-cy=add-to-cart-btn]').first().click();
      cy.get('[data-cy=cart-icon]').should('be.visible');
      cy.get('[data-cy=cart-count]').should('exist');
    });

    it('should prompt login when unauthenticated user adds to cart', () => {
      cy.clearCookies();
      cy.window().then((win) => { win.localStorage.clear(); });
      cy.visit('/products');
      cy.get('[data-cy=add-to-cart-btn]').first().click();
    });
  });

  context('Cart Page', () => {
    beforeEach(() => {
      cy.visit('/products');
      cy.get('[data-cy=add-to-cart-btn]').first().click();
      cy.visit('/cart');
    });

    it('should display cart items', () => {
      cy.get('[data-cy=cart-page]').should('be.visible');
      cy.get('[data-cy=cart-item]').should('have.length.greaterThan', 0);
    });

    it('should display item name and price', () => {
      cy.get('[data-cy=cart-item]').first().within(() => {
        cy.get('[data-cy=cart-item-name]').should('be.visible');
        cy.get('[data-cy=cart-item-price]').should('be.visible');
      });
    });

    it('should increase item quantity', () => {
      cy.get('[data-cy=item-quantity]').first().then(($qty) => {
        const initial = parseInt($qty.text());
        cy.get('[data-cy=increase-qty]').first().click();
        cy.get('[data-cy=item-quantity]').first().should('contain', initial + 1);
      });
    });

    it('should decrease item quantity', () => {
      cy.get('[data-cy=increase-qty]').first().click();
      cy.get('[data-cy=item-quantity]').first().then(($qty) => {
        const current = parseInt($qty.text());
        cy.get('[data-cy=decrease-qty]').first().click();
        cy.get('[data-cy=item-quantity]').first().should('contain', current - 1);
      });
    });

    it('should remove item from cart', () => {
      cy.get('[data-cy=cart-item]').then(($items) => {
        const initialCount = $items.length;
        cy.get('[data-cy=remove-item]').first().click();
        if (initialCount === 1) {
          cy.get('[data-cy=empty-cart]').should('be.visible');
        } else {
          cy.get('[data-cy=cart-item]').should('have.length', initialCount - 1);
        }
      });
    });

    it('should display cart total', () => {
      cy.get('[data-cy=cart-total]').should('be.visible');
      cy.get('[data-cy=cart-total]').invoke('text').should('match', /₹[\d,]+/);
    });

    it('should update total when quantity changes', () => {
      cy.get('[data-cy=cart-total]').invoke('text').then((initialTotal) => {
        cy.get('[data-cy=increase-qty]').first().click();
        cy.get('[data-cy=cart-total]').invoke('text').should('not.equal', initialTotal);
      });
    });
  });

  context('Empty Cart', () => {
    it('should show empty cart message when cart is empty', () => {
      cy.visit('/cart');
      cy.get('[data-cy=empty-cart]').should('be.visible');
    });
  });

  context('Checkout Navigation', () => {
    it('should navigate to checkout from cart', () => {
      cy.visit('/products');
      cy.get('[data-cy=add-to-cart-btn]').first().click();
      cy.visit('/cart');
      cy.get('[data-cy=checkout-btn]').click();
      cy.url().should('include', '/checkout');
    });
  });
});
