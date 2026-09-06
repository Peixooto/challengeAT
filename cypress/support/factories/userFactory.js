function uniqueId() {
  return `${Date.now()}${Math.floor(Math.random() * 100000)}`;
}

export function makeUser(overrides = {}) {
  return {
    nome: 'QA Automation',
    email: `qa.automation.${uniqueId()}@teste.com`,
    password: 'Senha@123',
    administrador: 'false',
    ...overrides,
  };
}

export function makeAdminUser(overrides = {}) {
  return makeUser({ administrador: 'true', ...overrides });
}
