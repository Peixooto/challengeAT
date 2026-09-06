// Builds ready-to-use ServeRest user payloads. The suite runs against a
// public, shared demo backend, so every generated user needs an email
// that is (practically) unique per call - that's what makes the whole
// suite safe to run once, a hundred times, or in parallel.

function uniqueId() {
  return `${Date.now()}${Math.floor(Math.random() * 100000)}`;
}

/**
 * A regular (non-admin) user.
 * @param {Partial<{nome: string, email: string, password: string, administrador: string}>} overrides
 */
export function makeUser(overrides = {}) {
  return {
    nome: 'QA Automation',
    email: `qa.automation.${uniqueId()}@teste.com`,
    password: 'Senha@123',
    administrador: 'false',
    ...overrides,
  };
}

/**
 * An administrator user - needed for the product-management endpoints,
 * which are restricted to `administrador: "true"` accounts.
 * @param {Partial<{nome: string, email: string, password: string, administrador: string}>} overrides
 */
export function makeAdminUser(overrides = {}) {
  return makeUser({ administrador: 'true', ...overrides });
}
