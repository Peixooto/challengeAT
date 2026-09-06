class CadastroPage {
  visit() {
    cy.visit('/cadastrarusuarios');
    return this;
  }

  preencher(user) {
    cy.get('[data-testid="nome"]').should('be.visible').type(user.nome);
    cy.get('[data-testid="email"]').should('be.visible').type(user.email);
    cy.get('[data-testid="password"]').should('be.visible').type(user.password);
    return this;
  }

  cadastrar() {
    cy.get('[data-testid="cadastrar"]').should('be.visible').click();
    return this;
  }

  cadastrarUsuario(user) {
    return this.preencher(user).cadastrar();
  }
}

export default new CadastroPage();
