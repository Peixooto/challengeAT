import { makeUser } from '../../support/factories/userFactory';
import HomePage from '../../support/pages/HomePage';
import ShoppingListPage from '../../support/pages/ShoppingListPage';

describe('Test cases', () => {
  let user;

  before(() => {
    user = makeUser();
    cy.apiCreateUser(user).its('status').should('eq', 201);
  });

  beforeEach(() => {
    cy.session(user.email, () => {
      cy.login(user.email, user.password);
      cy.url().should('include', '/home');
    }, {
      validate() {
        expect(window.localStorage.getItem('serverest/userToken')).to.exist;
      },
      cacheAcrossSpecs: true
    });

    HomePage.visit();
  });

  it('Should check items displayed after login', () => {
    const itensNavbar = [
      'Home',
      'Lista de Compras',
      'Carrinho',
      'Logout'
    ];

    HomePage.navbar().should('be.visible');
    itensNavbar.forEach((texto) => {
      HomePage.navbar().contains(texto).should('be.visible');
    });

    HomePage.titulo().should('have.text', 'Serverest Store');
    HomePage.campoPesquisar().should('have.attr', 'placeholder', 'Pesquisar Produtos');
    cy.get('h4').should('have.text', 'Produtos');

    HomePage.botaoPesquisar().should('be.visible');

    HomePage.grid().should('be.visible').and('have.length.greaterThan', 0);
  });

  it('Should allow you to add an item to the list', () => {
    cy.intercept('GET', '**/produtos?nome=logitech').as('getProdutos');

    HomePage.buscarProduto('logitech');

    cy.wait('@getProdutos');

    HomePage.grid().should('be.visible').and('contain.text', 'Logitech');
    HomePage.adicionarPrimeiroResultadoNaLista();
    cy.url().should('include', '/minhaListaDeProdutos');
    ShoppingListPage.adicionarAoCarrinho();
  });

  it('Should check the shopping list', () => {
    HomePage.irParaListaDeCompras();
    ShoppingListPage.titulo().should('have.text', 'Lista de Compras');
  });
});
