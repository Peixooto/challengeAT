class SignupPage {
  visit() {
    cy.visit('/cadastrarusuarios');
    return this;
  }

  fillForm(user) {
    cy.get('[data-testid="nome"]').should('be.visible').type(user.nome);
    cy.get('[data-testid="email"]').should('be.visible').type(user.email);
    cy.get('[data-testid="password"]').should('be.visible').type(user.password);
    return this;
  }

  submit() {
    cy.get('[data-testid="cadastrar"]').should('be.visible').click();
    return this;
  }

  registerUser(user) {
    return this.fillForm(user).submit();
  }
}

export default new SignupPage();
