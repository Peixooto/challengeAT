class ShoppingListPage {
  pageTitle() {
    return cy.get('h1');
  }

  addToCart() {
    cy.get('[data-testid="adicionar carrinho"]').click();
    return this;
  }
}

export default new ShoppingListPage();
