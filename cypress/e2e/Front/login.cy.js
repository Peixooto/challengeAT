import LoginPage from '../../support/pages/LoginPage';

describe('Login', () => {
  it('should show an error message for invalid credentials', () => {
    cy.intercept('POST', '**/login').as('login');

    LoginPage.login('usuario.inexistente@teste.com', 'senhaErrada');

    cy.wait('@login').its('response.statusCode').should('eq', 401);
    cy.contains('Email e/ou senha inválidos').should('be.visible');
    cy.url().should('include', '/login');
  });
});
