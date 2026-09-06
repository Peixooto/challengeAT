class ShoppingListPage {
  titulo() {
    return cy.get('h1');
  }

  adicionarAoCarrinho() {
    cy.get('[data-testid="adicionar carrinho"]').click();
    return this;
  }
}

export default new ShoppingListPage();
