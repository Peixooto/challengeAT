export function apiUrl(path = '') {
  return `${Cypress.expose('apiUrl')}${path}`;
}

export function apiRequest(options) {
  const { url, ...rest } = options;

  return cy.request({
    failOnStatusCode: false,
    ...rest,
    url: apiUrl(url),
  });
}
