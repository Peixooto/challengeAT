// Builds ready-to-use ServeRest product payloads with a unique name -
// /produtos rejects a duplicate `nome` with 400, so every generated
// product needs a name that has never been used before.

function uniqueId() {
  return `${Date.now()}${Math.floor(Math.random() * 100000)}`;
}

/**
 * @param {Partial<{nome: string, preco: number, descricao: string, quantidade: number}>} overrides
 */
export function makeProduct(overrides = {}) {
  return {
    nome: `Produto QA Automation ${uniqueId()}`,
    preco: 100,
    descricao: 'Produto gerado para automação de testes',
    quantidade: 10,
    ...overrides,
  };
}
