import faker from 'faker';

const { baseUrl } = Cypress.config();

export const mockAccount = () => ({
  name: faker.name.findName(),
  accessToken: faker.random.uuid(),
});

export const testInputStatus = (field: string, error = ''): void => {
  cy.getByTestId(`${field}-wrap`).should('have.attr', 'data-status', error ? 'invalid' : 'valid');
  cy.getByTestId(`${field}-label`).should('have.attr', 'title', error);
};

export const testMainError = (error: string) => {
  cy.getByTestId('spinner').should('not.exist');
  cy.getByTestId('main-error').should('contain.text', error);
};

export const testUrl = (path: string) => cy.url().should('equal', `${baseUrl}${path}`);

export const testLocalStorageItem = (field: string, value: string) =>
  cy.window().then((window) => assert.deepEqual(window.localStorage.getItem(field), value));

export const setLocalStorageItem = (key: string, value: object) =>
  localStorage.setItem(key, JSON.stringify(value));
