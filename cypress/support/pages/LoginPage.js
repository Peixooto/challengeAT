class LoginPage {
  visit() {
    cy.visit('/');
    return this;
  }

  login(email, password) {
    this.visit();
    cy.get('[data-testid="email"]').should('exist').clear().type(email);
    cy.get('[data-testid="senha"]').should('exist').clear().type(`${password}{enter}`);
    return this;
  }

  goToCadastro() {
    cy.get('[data-testid="cadastrar"]').should('be.visible').click();
    return this;
  }
}

export default new LoginPage();
