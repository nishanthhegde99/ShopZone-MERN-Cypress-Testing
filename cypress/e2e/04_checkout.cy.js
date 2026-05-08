/// <reference types="cypress" />

describe('Checkout Tests', () => {
  beforeEach(() => {
    cy.loginByApi(Cypress.env('userEmail'), Cypress.env('userPassword'));
    cy.clearCartByApi();
    cy.visit('/products');
    cy.get('[data-cy=add-to-cart-btn]').first().click();
    cy.visit('/checkout');
  });

  context('Address Form', () => {
    it('should display checkout page with address form', () => {
      cy.get('[data-cy=checkout-page]').should('be.visible');
      cy.get('[data-cy=address-form]').should('be.visible');
    });

    it('should show validation errors for empty address form', () => {
      cy.get('[data-cy=continue-to-payment]').click();
      cy.get('[data-cy=address-form]').should('be.visible');
    });

    it('should validate phone number format', () => {
      cy.fixture('users').then(({ shippingAddress }) => {
        cy.get('[data-cy=fullName-input]').type(shippingAddress.fullName);
        cy.get('[data-cy=phone-input]').type('123');
        cy.get('[data-cy=street-input]').type(shippingAddress.street);
        cy.get('[data-cy=city-input]').type(shippingAddress.city);
        cy.get('[data-cy=state-input]').type(shippingAddress.state);
        cy.get('[data-cy=pincode-input]').type(shippingAddress.pincode);
        cy.get('[data-cy=continue-to-payment]').click();
        cy.get('[data-cy=address-form]').should('be.visible');
      });
    });

    it('should proceed to payment with valid address', () => {
      cy.fixture('users').then(({ shippingAddress }) => {
        cy.get('[data-cy=fullName-input]').type(shippingAddress.fullName);
        cy.get('[data-cy=phone-input]').type(shippingAddress.phone);
        cy.get('[data-cy=street-input]').type(shippingAddress.street);
        cy.get('[data-cy=city-input]').type(shippingAddress.city);
        cy.get('[data-cy=state-input]').type(shippingAddress.state);
        cy.get('[data-cy=pincode-input]').type(shippingAddress.pincode);
        cy.get('[data-cy=continue-to-payment]').click();
        cy.get('[data-cy=payment-form]').should('be.visible');
      });
    });
  });

  context('Payment Selection', () => {
    beforeEach(() => {
      cy.fixture('users').then(({ shippingAddress }) => {
        cy.get('[data-cy=fullName-input]').type(shippingAddress.fullName);
        cy.get('[data-cy=phone-input]').type(shippingAddress.phone);
        cy.get('[data-cy=street-input]').type(shippingAddress.street);
        cy.get('[data-cy=city-input]').type(shippingAddress.city);
        cy.get('[data-cy=state-input]').type(shippingAddress.state);
        cy.get('[data-cy=pincode-input]').type(shippingAddress.pincode);
        cy.get('[data-cy=continue-to-payment]').click();
      });
    });

    it('should display payment options', () => {
      cy.get('[data-cy=payment-form]').should('be.visible');
      cy.get('[data-cy=payment-COD]').should('be.visible');
      cy.get('[data-cy=payment-Card]').should('be.visible');
      cy.get('[data-cy=payment-UPI]').should('be.visible');
    });

    it('should select COD payment method', () => {
      cy.get('[data-cy=payment-COD]').check();
      cy.get('[data-cy=payment-COD]').should('be.checked');
    });

    it('should select Card payment method', () => {
      cy.get('[data-cy=payment-Card]').check();
      cy.get('[data-cy=payment-Card]').should('be.checked');
    });

    it('should proceed to order review', () => {
      cy.get('[data-cy=continue-to-review]').click();
      cy.get('[data-cy=order-review]').should('be.visible');
    });
  });

  context('Order Placement', () => {
    it('should place order successfully with COD', () => {
      cy.fixture('users').then(({ shippingAddress }) => {
        cy.get('[data-cy=fullName-input]').type(shippingAddress.fullName);
        cy.get('[data-cy=phone-input]').type(shippingAddress.phone);
        cy.get('[data-cy=street-input]').type(shippingAddress.street);
        cy.get('[data-cy=city-input]').type(shippingAddress.city);
        cy.get('[data-cy=state-input]').type(shippingAddress.state);
        cy.get('[data-cy=pincode-input]').type(shippingAddress.pincode);
        cy.get('[data-cy=continue-to-payment]').click();
        cy.get('[data-cy=payment-COD]').check();
        cy.get('[data-cy=continue-to-review]').click();
        cy.get('[data-cy=place-order-btn]').click();
        cy.url().should('include', '/order-success/');
        cy.get('[data-cy=order-success-page]').should('be.visible');
      });
    });

    it('should display order total in checkout summary', () => {
      cy.get('[data-cy=order-total]').should('be.visible');
      cy.get('[data-cy=order-total]').invoke('text').should('match', /₹[\d,]+/);
    });
  });
});
