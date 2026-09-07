import { makeUser } from '../../support/factories/userFactory';
import LoginPage from '../../support/pages/LoginPage';
import SignupPage from '../../support/pages/SignupPage';

describe('Sign', () => {
  const user = makeUser();

  it('should create a new login', () => {
    cy.intercept('POST', '**/usuarios').as('newUser');

    LoginPage.visit().goToSignup();
    cy.url().should('include', '/cadastrarusuarios');
    SignupPage.registerUser(user);

    cy.wait('@newUser').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
      expect(interception.response.body.message).to.equal(
        'Cadastro realizado com sucesso'
      );
    });
  });

  it('should not create the same login', () => {
    cy.signValidate(user);
  });
});
