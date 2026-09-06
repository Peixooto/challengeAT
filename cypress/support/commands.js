import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import { makeUser } from './factories/userFactory';
import * as usuariosService from './services/usuariosService';

Cypress.Commands.add('login', (email, password) => {
    LoginPage.login(email, password);
});

Cypress.Commands.add('apiCreateUser', (user) => {
    return usuariosService.create(user);
});

Cypress.Commands.add('signValidate', (user) => {
    const targetUser = user || makeUser();

    cy.apiCreateUser(targetUser);

    cy.intercept('POST', '**/usuarios').as('newUser');

    LoginPage.visit().goToCadastro();
    cy.url().should('include', '/cadastrarusuarios');
    CadastroPage.cadastrarUsuario(targetUser);

    cy.wait('@newUser').then((interception) => {
        expect(interception.response.statusCode).to.equal(400);
        expect(interception.response.body.message).to.equal('Este email já está sendo usado');
    });
});
