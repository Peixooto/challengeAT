import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { makeUser } from './factories/userFactory';
import * as userService from './services/userService';

Cypress.Commands.add('login', (email, password) => {
    LoginPage.login(email, password);
});

Cypress.Commands.add('apiCreateUser', (user) => {
    return userService.create(user);
});

Cypress.Commands.add('signValidate', (user) => {
    const targetUser = user || makeUser();

    cy.apiCreateUser(targetUser);

    cy.intercept('POST', '**/usuarios').as('newUser');

    LoginPage.visit().goToSignup();
    cy.url().should('include', '/cadastrarusuarios');
    SignupPage.registerUser(targetUser);

    cy.wait('@newUser').then((interception) => {
        expect(interception.response.statusCode).to.equal(400);
        expect(interception.response.body.message).to.equal('Este email já está sendo usado');
    });
});
