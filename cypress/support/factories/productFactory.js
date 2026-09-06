function uniqueId() {
  return `${Date.now()}${Math.floor(Math.random() * 100000)}`;
}

export function makeProduct(overrides = {}) {
  return {
    nome: `QA Automation Product ${uniqueId()}`,
    preco: 100,
    descricao: 'Test product generated for automation',
    quantidade: 10,
    ...overrides,
  };
}
