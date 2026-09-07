import { makeUser } from '../../support/factories/userFactory';
import HomePage from '../../support/pages/HomePage';

describe('Test cases', () => {
  // A fixed account like "ana@banana.com" isn't guaranteed to exist on the
  // shared ServeRest demo server (it may never have been created, or may
  // have been created with a different password by someone else running
  // this same challenge). Creating our own user via the API before every
  // run removes that dependency entirely, so login stays reliable no
  // matter how many times or in what order the suite is executed.
  let user;

  before(() => {
    user = makeUser();
    cy.apiCreateUser(user).its('status').should('eq', 201);
  });

  beforeEach(() => {
    cy.session(
      user.email,
      () => {
        cy.login(user.email, user.password);
        cy.url().should('include', '/home');
      },
      {
        validate() {
          expect(window.localStorage.getItem('serverest/userToken')).to.exist;
        },
        cacheAcrossSpecs: true,
      }
    );

    HomePage.visit();
  });

  it('Should check items displayed after login', () => {
    const navbarItems = ['Home', 'Lista de Compras', 'Carrinho', 'Logout'];

    HomePage.navbar().should('be.visible');
    navbarItems.forEach((text) => {
      HomePage.navbar().contains(text).should('be.visible');
    });

    HomePage.pageTitle().should('have.text', 'Serverest Store');
    HomePage.searchInput().should(
      'have.attr',
      'placeholder',
      'Pesquisar Produtos'
    );
    cy.get('h4').should('have.text', 'Produtos');

    HomePage.searchButton().should('be.visible');

    HomePage.grid().should('be.visible').and('have.length.greaterThan', 0);
  });

  it('should show no results when searching for a non-existent product', () => {
    const term = `produto-que-nao-existe-${Date.now()}`;
    cy.intercept('GET', `**/produtos?nome=${term}`).as('getProdutos');

    HomePage.searchProduct(term);

    cy.wait('@getProdutos').its('response.body.quantidade').should('eq', 0);
    HomePage.grid().should('have.text', 'Nenhum produto foi encontrado');
  });

  it('should log out and clear the session', () => {
    HomePage.navbar().contains('Logout').click();

    cy.url().should('include', '/login');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('serverest/userToken')).to.be.null;
    });
  });
});
