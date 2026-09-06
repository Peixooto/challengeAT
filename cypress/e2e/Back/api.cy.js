import { makeUser, makeAdminUser } from '../../support/factories/userFactory';
import { makeProduct } from '../../support/factories/productFactory';
import * as loginService from '../../support/services/loginService';
import * as usuariosService from '../../support/services/usuariosService';
import * as produtosService from '../../support/services/produtosService';

describe('API - Login', () => {
  it('should authenticate with valid credentials and return a token', () => {
    const user = makeUser();

    usuariosService.create(user).its('status').should('eq', 201);

    loginService.login({ email: user.email, password: user.password }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Login realizado com sucesso');
      expect(response.body.authorization).to.match(/^Bearer\s.+/);
    });
  });

  it('should reject invalid credentials with 401', () => {
    loginService
      .login({ email: 'usuario.inexistente@teste.com', password: 'senhaErrada' })
      .then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.eq('Email e/ou senha inválidos');
      });
  });
});

describe('API - Users', () => {
  it('should register a new user successfully', () => {
    const user = makeUser();

    usuariosService.create(user).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body._id).to.be.a('string').and.not.be.empty;
    });
  });

  it('should not allow registration with an email already in use', () => {
    const user = makeUser();

    usuariosService.create(user).its('status').should('eq', 201);

    usuariosService.create(user).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Este email já está sendo usado');
    });
  });
});

describe('API - Products (authorization rules)', () => {
  it('should reject product registration without an authentication token (401)', () => {
    produtosService.create(makeProduct()).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq(
        'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
      );
    });
  });

  it('should prevent a non-admin user from registering a product (403)', () => {
    const user = makeUser();
    usuariosService.create(user).its('status').should('eq', 201);

    loginService.login({ email: user.email, password: user.password }).then((loginResponse) => {
      produtosService.create(makeProduct(), loginResponse.body.authorization).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body.message).to.eq('Rota exclusiva para administradores');
      });
    });
  });

  it('should allow an administrator to register a product, which then exists', () => {
    const admin = makeAdminUser();
    usuariosService.create(admin).its('status').should('eq', 201);

    loginService.login({ email: admin.email, password: admin.password }).then((loginResponse) => {
      const product = makeProduct();

      produtosService.create(product, loginResponse.body.authorization).then((createResponse) => {
        expect(createResponse.status).to.eq(201);
        expect(createResponse.body.message).to.eq('Cadastro realizado com sucesso');

        produtosService.getById(createResponse.body._id).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body.nome).to.eq(product.nome);
          expect(getResponse.body.preco).to.eq(product.preco);
        });
      });
    });
  });
});
