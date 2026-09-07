import { makeUser, makeAdminUser } from '../../support/factories/userFactory';
import { makeProduct } from '../../support/factories/productFactory';
import * as userService from '../../support/services/userService';
import * as productService from '../../support/services/productService';
import * as loginService from '../../support/services/loginService';
import HomePage from '../../support/pages/HomePage';
import ShoppingListPage from '../../support/pages/ShoppingListPage';

describe('Shopping cart', () => {
  let shopper;
  let product;

  before(() => {
    const admin = makeAdminUser();
    userService.create(admin).its('status').should('eq', 201);

    loginService.login({ email: admin.email, password: admin.password }).then((loginResponse) => {
      product = makeProduct();
      productService.create(product, loginResponse.body.authorization).its('status').should('eq', 201);
    });

    shopper = makeUser();
    userService.create(shopper).its('status').should('eq', 201);
  });

  beforeEach(() => {
    cy.session(shopper.email, () => {
      cy.login(shopper.email, shopper.password);
      cy.url().should('include', '/home');
    }, {
      validate() {
        expect(window.localStorage.getItem('serverest/userToken')).to.exist;
      },
      cacheAcrossSpecs: true
    });

    HomePage.visit();
  });

  it('should allow you to add the product to the list and to the cart', () => {
    cy.intercept('GET', `**/produtos?nome=${encodeURIComponent(product.nome)}`).as('getProdutos');

    HomePage.searchProduct(product.nome);

    cy.wait('@getProdutos');

    HomePage.grid().should('be.visible').and('contain.text', product.nome);
    HomePage.addFirstResultToList();
    cy.url().should('include', '/minhaListaDeProdutos');
    ShoppingListPage.addToCart();
  });

  it('should check the shopping list', () => {
    HomePage.goToShoppingList();
    ShoppingListPage.pageTitle().should('have.text', 'Lista de Compras');
  });
});
