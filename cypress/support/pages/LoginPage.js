class LoginPage {
  visit() {
    cy.visit('/login');
    return this;
  }

  login(email, password) {
    this.visit();
    cy.get('[data-testid="email"]').should('exist').clear().type(email);
    cy.get('[data-testid="senha"]').should('exist').clear().type(`${password}{enter}`);
    return this;
  }

  goToSignup() {
    cy.get('[data-testid="cadastrar"]').should('be.visible').click();
    return this;
  }
}

export default new LoginPage();
