export function apiUrl(path = '') {
  return `${Cypress.expose('apiUrl')}${path}`;
}

export function apiRequest(options) {
  const { url, ...rest } = options;

  return cy.api({
    failOnStatusCode: false,
    ...rest,
    url: apiUrl(url),
  });
}
