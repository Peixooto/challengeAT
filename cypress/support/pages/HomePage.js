class HomePage {
  visit() {
    cy.visit('/home');
    return this;
  }

  navbar() {
    return cy.get('#navbarTogglerDemo01');
  }

  pageTitle() {
    return cy.get('h1');
  }

  searchInput() {
    return cy.get('[data-testid="pesquisar"]');
  }

  searchButton() {
    return cy.get('[data-testid="botaoPesquisar"]');
  }

  grid() {
    return cy.get('.row.espacamento');
  }

  searchProduct(name) {
    this.searchInput().type(name);
    this.searchButton().scrollIntoView().should('be.visible').click();
    return this;
  }

  addFirstResultToList() {
    cy.get('[data-testid="adicionarNaLista"]').should('be.visible').click();
    return this;
  }

  goToShoppingList() {
    cy.get('[data-testid="lista-de-compras"]').click();
    return this;
  }
}

export default new HomePage();
