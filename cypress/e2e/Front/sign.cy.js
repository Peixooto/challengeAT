import { makeUser } from '../../support/factories/userFactory';
import LoginPage from '../../support/pages/LoginPage';
import CadastroPage from '../../support/pages/CadastroPage';

describe('Sign', () => {
    const user = makeUser();

    it('should create a new login', () => {
        cy.intercept('POST', '**/usuarios').as('newUser');

        LoginPage.visit().goToCadastro();
        cy.url().should('include', '/cadastrarusuarios');
        CadastroPage.cadastrarUsuario(user);

        cy.wait('@newUser').then((interception) => {
            expect(interception.response.statusCode).to.equal(201);
            expect(interception.response.body.message).to.equal('Cadastro realizado com sucesso');
        });
    });

    it('should not create the same login', () => {
        cy.signValidate(user);
    });
});
