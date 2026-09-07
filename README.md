# challengeAT

[![Cypress Tests](https://github.com/Peixooto/challengeAT/actions/workflows/cypress.yml/badge.svg)](https://github.com/Peixooto/challengeAT/actions/workflows/cypress.yml)

Automação de testes E2E (front-end) e de API para a aplicação [ServeRest](https://serverest.dev/), como parte do desafio técnico de QA.

- **Front-end sob teste:** https://front.serverest.dev/
- **API sob teste:** https://serverest.dev/ (spec Swagger em `https://serverest.dev/swagger.json`)
- **Framework:** [Cypress](https://www.cypress.io/) 16 + JavaScript
- **Relatório de testes:** https://peixooto.github.io/challengeAT/ atualizado automaticamente a cada push na `main`, sem precisar rodar nada localmente

## Como rodar

```bash
npm install
npm run cypress:open   # modo interativo (UI)
npm run cypress:run    # modo headless utilizando o chrome
```

Não é necessário configurar nenhuma conta/usuário previamente — os testes criam seus próprios dados de teste em tempo de execução (ver [Estratégia de dados de teste](#estratégia-de-dados-de-teste-e-login-dinâmico) abaixo).

## Estrutura do projeto

```
cypress/
├── e2e/
│   ├── Front/            # Testes E2E via UI
│   │   ├── tests.cy.js
│   │   ├── sign.cy.js
│   │   ├── login.cy.js
│   │   └── shoppingCart.cy.js
│   └── Back/             # Testes de API
│       └── api.cy.js
├── support/
│   ├── pages/            # Page Object Model — uma classe por tela
│   │   ├── LoginPage.js
│   │   ├── SignupPage.js
│   │   ├── HomePage.js
│   │   └── ShoppingListPage.js
│   ├── services/         # Camada de API
│   │   ├── apiClient.js
│   │   ├── loginService.js
│   │   ├── userService.js
│   │   ├── productService.js
│   │   └── cartService.js
│   ├── factories/        # Geração de massa de dados por entidade
│   │   ├── userFactory.js
│   │   ├── productFactory.js
│   │   └── cartFactory.js
│   ├── commands.js       # Comandos customizados
│   └── e2e.js
└── fixtures/
cypress.config.js
.github/workflows/cypress.yml   # CI: roda a suíte a cada push/PR
```

## Estratégia de dados de teste e login dinâmico

A ServeRest é uma API **pública e compartilhada** e os dados cadastrados nunca são exclusivos desse projeto. Duas decisões de design partem disso:

1. **Nenhuma credencial fixa no código.** Um e-mail fixo como `ana@banana.com` pode nunca ter existido, pode já ter sido criado por outra pessoa com outra senha, ou pode ser resetado pela equipe do ServeRest — qualquer teste que dependa disso é frágil por definição. Em vez disso, `makeUser()` ([factories/userFactory.js](cypress/support/factories/userFactory.js)) gera um usuário com e-mail único (timestamp + número aleatório) a cada execução, e `cy.apiCreateUser()` ([commands.js](cypress/support/commands.js)) o cria direto via API (`POST /usuarios`, via [userService](cypress/support/services/userService.js)) antes de qualquer teste de UI depender dele. Isso também deixa a suíte **idempotente**: rodar 1 vez, 10 vezes seguidas, ou em paralelo, nunca esbarra em "e-mail já cadastrado" ou "usuário não existe".
2. **`cy.session()`** cacheia a sessão autenticada por execução (chaveada pelo e-mail dinâmico do usuário), evitando logins repetidos a cada teste sem arriscar reaproveitar uma sessão de um usuário que não existe mais.
3. **O mesmo vale pra produto, não só pra usuário.** O catálogo também é compartilhado, e qualquer conta administradora pode editar/excluir qualquer produto (não é escopado por usuário) — buscar por um nome fixo como `"logitech"` supõe que aquele produto específico de outra pessoa ainda exista. [`shoppingCart.cy.js`](cypress/e2e/Front/shoppingCart.cy.js) resolve isso do mesmo jeito: cadastra seu próprio admin e o próprio produto via API (`POST /produtos`, via [productService](cypress/support/services/productService.js)) antes de buscar por ele na UI.

## Casos de teste

### Front-end (E2E) — `cypress/e2e/Front`

| #   | Cenário                                                                                           | Status   |
| --- | ------------------------------------------------------------------------------------------------- | -------- |
| 1   | Exibir corretamente os elementos da Home após login (navbar, título, busca, listagem de produtos) | feito    |
| 2   | Buscar um produto, adicionar à lista de produtos e ao carrinho                                    | feito    |
| 3   | Acessar "Lista de Compras" e validar o conteúdo da página                                         | feito    |
| 4   | Cadastrar novo usuário com sucesso (201 + mensagem de confirmação)                                | feito    |
| 5   | Impedir cadastro de usuário com e-mail já utilizado (400 + mensagem de erro)                      | feito    |
| 6   | Login com credenciais inválidas exibe mensagem de erro                                            | feito    |
| 7   | Buscar produto inexistente resulta em listagem vazia                                              | feito    |
| 8   | Logout limpa a sessão (localStorage) e redireciona para `/login`                                  | feito    |
| 9   | Cadastro com campos obrigatórios vazios exibe validação adequada                                  | pendente |
| 10  | Remover item da lista de produtos / do carrinho                                                   | pendente |
| 11  | Concluir compra reflete corretamente no carrinho pela UI                                          | pendente |
| 12  | Usuário administrador acessa e opera a área `/admin` (cadastro/edição de produtos)                | pendente |

_Itens pendentes dependem de telas/fluxos ainda não validados manualmente._

_A tela de carrinho encontra-se incompleta no momento._

### API — `cypress/e2e/Back`

Cobre praticamente toda a superfície do Swagger (`https://serverest.dev/swagger.json`): login, CRUD completo de usuários e de produtos (com as regras de autorização de admin), e o fluxo inteiro de carrinho (estoque, limite de 1 carrinho ativo por usuário, concluir vs. cancelar compra). Todas as mensagens/códigos abaixo foram conferidos ao vivo contra a API real antes de virar asserção.

| #   | Cenário                                                                                                | Endpoint                            | Status |
| --- | ------------------------------------------------------------------------------------------------------ | ----------------------------------- | ------ |
| 1   | Login com credenciais válidas retorna 200 e um token                                                   | `POST /login`                       | feito  |
| 2   | Login com credenciais inválidas retorna 401 e mensagem correta                                         | `POST /login`                       | feito  |
| 3   | Cadastro de usuário com sucesso retorna 201                                                            | `POST /usuarios`                    | feito  |
| 4   | Cadastro de usuário com e-mail duplicado retorna 400                                                   | `POST /usuarios`                    | feito  |
| 5   | Cadastro de usuário com corpo vazio retorna 400 com a validação de cada campo                          | `POST /usuarios`                    | feito  |
| 6   | Busca de usuário por id retorna os dados corretos                                                      | `GET /usuarios/{_id}`               | feito  |
| 7   | Edição de usuário reflete os novos dados                                                               | `PUT /usuarios/{_id}`               | feito  |
| 8   | Exclusão de usuário bem-sucedida e usuário some da listagem                                            | `DELETE /usuarios/{_id}`            | feito  |
| 9   | Requisição sem token de autenticação recebe 401                                                        | `POST /produtos`                    | feito  |
| 10  | Usuário **não-administrador** tentando cadastrar produto recebe 403 (regra de negócio)                 | `POST /produtos`                    | feito  |
| 11  | Administrador cadastra produto com sucesso (201) e o produto passa a existir via `GET /produtos/{_id}` | `POST` + `GET /produtos`            | feito  |
| 12  | Administrador edita um produto e a alteração é refletida                                               | `PUT /produtos/{_id}`               | feito  |
| 13  | Administrador exclui um produto e ele some da base                                                     | `DELETE /produtos/{_id}`            | feito  |
| 14  | Busca de produto inexistente retorna lista vazia                                                       | `GET /produtos?nome=...`            | feito  |
| 15  | Criar carrinho decrementa o estoque do produto                                                         | `POST /carrinhos`                   | feito  |
| 16  | Usuário não pode ter mais de 1 carrinho ativo (400)                                                    | `POST /carrinhos`                   | feito  |
| 17  | Concluir compra finaliza o carrinho e mantém o estoque decrementado                                    | `DELETE /carrinhos/concluir-compra` | feito  |
| 18  | Cancelar compra finaliza o carrinho e devolve o estoque                                                | `DELETE /carrinhos/cancelar-compra` | feito  |

## Relatório de testes (Mochawesome)

O relatório é gerado pelo [`cypress-mochawesome-reporter`](https://github.com/LironEr/cypress-mochawesome-reporter) e publicado automaticamente no GitHub Pages pelo CI ([.github/workflows/cypress.yml](.github/workflows/cypress.yml)) a cada push/PR na `main` — inclusive quando algum teste falha, pra sempre refletir a última execução.

### Rodando localmente

```bash
npm run cypress:run   # já gera o relatório em cypress/reports/html/index.html
```

Não precisa de nenhum passo extra de geração — o HTML final (com screenshots embutidos) já sai pronto ao final do `cypress run`.
