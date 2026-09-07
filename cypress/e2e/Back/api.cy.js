import { makeUser, makeAdminUser } from '../../support/factories/userFactory';
import { makeProduct } from '../../support/factories/productFactory';
import * as loginService from '../../support/services/loginService';
import * as userService from '../../support/services/userService';
import * as productService from '../../support/services/productService';
import * as cartService from '../../support/services/cartService';

describe('API - Login', () => {
  it('should authenticate with valid credentials and return a token', () => {
    const user = makeUser();

    userService.create(user).its('status').should('eq', 201);

    loginService
      .login({ email: user.email, password: user.password })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Login realizado com sucesso');
        expect(response.body.authorization).to.match(/^Bearer\s.+/);
      });
  });

  it('should reject invalid credentials with 401', () => {
    loginService
      .login({
        email: 'usuario.inexistente@teste.com',
        password: 'senhaErrada',
      })
      .then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.message).to.eq('Email e/ou senha inválidos');
      });
  });
});

describe('API - Users', () => {
  it('should register a new user successfully', () => {
    const user = makeUser();

    userService.create(user).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body._id).to.be.a('string').and.not.be.empty;
    });
  });

  it('should not allow registration with an email already in use', () => {
    const user = makeUser();

    userService.create(user).its('status').should('eq', 201);

    userService.create(user).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.eq('Este email já está sendo usado');
    });
  });

  it('should require nome, email, password and administrador on registration', () => {
    userService.create({}).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.deep.eq({
        nome: 'nome é obrigatório',
        email: 'email é obrigatório',
        password: 'password é obrigatório',
        administrador: 'administrador é obrigatório',
      });
    });
  });

  it('should fetch a user by id', () => {
    const user = makeUser();

    userService.create(user).then((createResponse) => {
      userService.getById(createResponse.body._id).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.nome).to.eq(user.nome);
        expect(getResponse.body.email).to.eq(user.email);
      });
    });
  });

  it("should update a user's data", () => {
    const user = makeUser();
    const updatedUser = makeUser();

    userService.create(user).then((createResponse) => {
      userService
        .update(createResponse.body._id, updatedUser)
        .then((updateResponse) => {
          expect(updateResponse.status).to.eq(200);
          expect(updateResponse.body.message).to.eq(
            'Registro alterado com sucesso'
          );

          userService.getById(createResponse.body._id).then((getResponse) => {
            expect(getResponse.body.nome).to.eq(updatedUser.nome);
            expect(getResponse.body.email).to.eq(updatedUser.email);
          });
        });
    });
  });

  it('should delete a user', () => {
    const user = makeUser();

    userService.create(user).then((createResponse) => {
      const userId = createResponse.body._id;

      userService.remove(userId).then((removeResponse) => {
        expect(removeResponse.status).to.eq(200);
        expect(removeResponse.body.message).to.eq(
          'Registro excluído com sucesso'
        );
      });

      userService.getById(userId).then((getResponse) => {
        expect(getResponse.status).to.eq(400);
        expect(getResponse.body.message).to.eq('Usuário não encontrado');
      });
    });
  });
});

describe('API - Products', () => {
  it('should reject product registration without an authentication token (401)', () => {
    productService.create(makeProduct()).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body.message).to.eq(
        'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais'
      );
    });
  });

  it('should prevent a non-admin user from registering a product (403)', () => {
    const user = makeUser();
    userService.create(user).its('status').should('eq', 201);

    loginService
      .login({ email: user.email, password: user.password })
      .then((loginResponse) => {
        productService
          .create(makeProduct(), loginResponse.body.authorization)
          .then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.message).to.eq(
              'Rota exclusiva para administradores'
            );
          });
      });
  });

  it('should allow an administrator to register a product, which then exists', () => {
    const admin = makeAdminUser();
    userService.create(admin).its('status').should('eq', 201);

    loginService
      .login({ email: admin.email, password: admin.password })
      .then((loginResponse) => {
        const product = makeProduct();

        productService
          .create(product, loginResponse.body.authorization)
          .then((createResponse) => {
            expect(createResponse.status).to.eq(201);
            expect(createResponse.body.message).to.eq(
              'Cadastro realizado com sucesso'
            );

            productService
              .getById(createResponse.body._id)
              .then((getResponse) => {
                expect(getResponse.status).to.eq(200);
                expect(getResponse.body.nome).to.eq(product.nome);
                expect(getResponse.body.preco).to.eq(product.preco);
              });
          });
      });
  });

  it('should allow an administrator to update a product', () => {
    const admin = makeAdminUser();
    userService.create(admin).its('status').should('eq', 201);

    loginService
      .login({ email: admin.email, password: admin.password })
      .then((loginResponse) => {
        const authorization = loginResponse.body.authorization;

        productService
          .create(makeProduct(), authorization)
          .then((createResponse) => {
            const updatedProduct = makeProduct();

            productService
              .update(createResponse.body._id, updatedProduct, authorization)
              .then((updateResponse) => {
                expect(updateResponse.status).to.eq(200);
                expect(updateResponse.body.message).to.eq(
                  'Registro alterado com sucesso'
                );

                productService
                  .getById(createResponse.body._id)
                  .then((getResponse) => {
                    expect(getResponse.body.nome).to.eq(updatedProduct.nome);
                    expect(getResponse.body.preco).to.eq(updatedProduct.preco);
                  });
              });
          });
      });
  });

  it('should allow an administrator to delete a product', () => {
    const admin = makeAdminUser();
    userService.create(admin).its('status').should('eq', 201);

    loginService
      .login({ email: admin.email, password: admin.password })
      .then((loginResponse) => {
        const authorization = loginResponse.body.authorization;

        productService
          .create(makeProduct(), authorization)
          .then((createResponse) => {
            const productId = createResponse.body._id;

            productService
              .remove(productId, authorization)
              .then((removeResponse) => {
                expect(removeResponse.status).to.eq(200);
                expect(removeResponse.body.message).to.eq(
                  'Registro excluído com sucesso'
                );
              });

            productService.getById(productId).then((getResponse) => {
              expect(getResponse.status).to.eq(400);
              expect(getResponse.body.message).to.eq('Produto não encontrado');
            });
          });
      });
  });

  it('should show no results when searching for a non-existent product', () => {
    productService
      .getByName(`produto-que-nao-existe-${Date.now()}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.quantidade).to.eq(0);
        expect(response.body.produtos).to.deep.eq([]);
      });
  });
});

describe('API - Shopping cart', () => {
  it("should decrease the product's stock when a cart is created", () => {
    const admin = makeAdminUser();
    userService.create(admin).its('status').should('eq', 201);

    const buyer = makeUser();
    userService.create(buyer).its('status').should('eq', 201);

    loginService
      .login({ email: admin.email, password: admin.password })
      .then((adminLogin) => {
        productService
          .create(makeProduct({ quantidade: 5 }), adminLogin.body.authorization)
          .then((product) => {
            loginService
              .login({ email: buyer.email, password: buyer.password })
              .then((buyerLogin) => {
                const authorization = buyerLogin.body.authorization;

                cartService
                  .create(
                    {
                      produtos: [
                        { idProduto: product.body._id, quantidade: 2 },
                      ],
                    },
                    authorization
                  )
                  .then((cartResponse) => {
                    expect(cartResponse.status).to.eq(201);

                    productService
                      .getById(product.body._id)
                      .then((getResponse) => {
                        expect(getResponse.body.quantidade).to.eq(3);
                      });

                    cartService.cancelPurchase(authorization);
                  });
              });
          });
      });
  });

  it('should not allow a user to have more than one active cart', () => {
    const admin = makeAdminUser();
    userService.create(admin).its('status').should('eq', 201);

    const buyer = makeUser();
    userService.create(buyer).its('status').should('eq', 201);

    loginService
      .login({ email: admin.email, password: admin.password })
      .then((adminLogin) => {
        productService
          .create(makeProduct({ quantidade: 5 }), adminLogin.body.authorization)
          .then((product) => {
            loginService
              .login({ email: buyer.email, password: buyer.password })
              .then((buyerLogin) => {
                const authorization = buyerLogin.body.authorization;
                const cart = {
                  produtos: [{ idProduto: product.body._id, quantidade: 1 }],
                };

                cartService
                  .create(cart, authorization)
                  .its('status')
                  .should('eq', 201);

                cartService.create(cart, authorization).then((response) => {
                  expect(response.status).to.eq(400);
                  expect(response.body.message).to.eq(
                    'Não é permitido ter mais de 1 carrinho'
                  );
                });

                cartService.cancelPurchase(authorization);
              });
          });
      });
  });

  it('should complete a purchase, keeping the stock decreased', () => {
    const admin = makeAdminUser();
    userService.create(admin).its('status').should('eq', 201);

    const buyer = makeUser();
    userService.create(buyer).its('status').should('eq', 201);

    loginService
      .login({ email: admin.email, password: admin.password })
      .then((adminLogin) => {
        productService
          .create(makeProduct({ quantidade: 5 }), adminLogin.body.authorization)
          .then((product) => {
            loginService
              .login({ email: buyer.email, password: buyer.password })
              .then((buyerLogin) => {
                const authorization = buyerLogin.body.authorization;

                cartService
                  .create(
                    {
                      produtos: [
                        { idProduto: product.body._id, quantidade: 2 },
                      ],
                    },
                    authorization
                  )
                  .its('status')
                  .should('eq', 201);

                cartService.completePurchase(authorization).then((response) => {
                  expect(response.status).to.eq(200);
                  expect(response.body.message).to.eq(
                    'Registro excluído com sucesso'
                  );
                });

                productService.getById(product.body._id).then((getResponse) => {
                  expect(getResponse.body.quantidade).to.eq(3);
                });
              });
          });
      });
  });

  it('should cancel a purchase, restoring the stock', () => {
    const admin = makeAdminUser();
    userService.create(admin).its('status').should('eq', 201);

    const buyer = makeUser();
    userService.create(buyer).its('status').should('eq', 201);

    loginService
      .login({ email: admin.email, password: admin.password })
      .then((adminLogin) => {
        productService
          .create(makeProduct({ quantidade: 5 }), adminLogin.body.authorization)
          .then((product) => {
            loginService
              .login({ email: buyer.email, password: buyer.password })
              .then((buyerLogin) => {
                const authorization = buyerLogin.body.authorization;

                cartService
                  .create(
                    {
                      produtos: [
                        { idProduto: product.body._id, quantidade: 2 },
                      ],
                    },
                    authorization
                  )
                  .its('status')
                  .should('eq', 201);

                cartService.cancelPurchase(authorization).then((response) => {
                  expect(response.status).to.eq(200);
                  expect(response.body.message).to.eq(
                    'Registro excluído com sucesso. Estoque dos produtos reabastecido'
                  );
                });

                productService.getById(product.body._id).then((getResponse) => {
                  expect(getResponse.body.quantidade).to.eq(5);
                });
              });
          });
      });
  });
});
