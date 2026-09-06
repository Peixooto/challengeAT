class HomePage {
  visit() {
    cy.visit('/home');
    return this;
  }

  navbar() {
    return cy.get('#navbarTogglerDemo01');
  }

  titulo() {
    return cy.get('h1');
  }

  campoPesquisar() {
    return cy.get('[data-testid="pesquisar"]');
  }

  botaoPesquisar() {
    return cy.get('[data-testid="botaoPesquisar"]');
  }

  grid() {
    return cy.get('.row.espacamento');
  }

  buscarProduto(nome) {
    this.campoPesquisar().type(nome);
    this.botaoPesquisar().scrollIntoView().should('be.visible').click();
    return this;
  }

  adicionarPrimeiroResultadoNaLista() {
    cy.get('[data-testid="adicionarNaLista"]').should('be.visible').click();
    return this;
  }

  irParaListaDeCompras() {
    cy.get('[data-testid="lista-de-compras"]').click();
    return this;
  }
}

export default new HomePage();
