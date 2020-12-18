import faker from 'faker';

import * as Helpers from '../support/helpers';
import { Interceptor } from '../support/interceptor';

const populateFields = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email());
  Helpers.testInputStatus('email');
  cy.getByTestId('password').focus().type(faker.internet.password(5));
  Helpers.testInputStatus('password');
};

const simulateValidSubmit = (): void => {
  populateFields();
  cy.getByTestId('submit').click();
};

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login');
  });

  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly');
    Helpers.testInputStatus('email', 'Campo Obrigatório');
    cy.getByTestId('password').should('have.attr', 'readOnly');
    Helpers.testInputStatus('password', 'Campo Obrigatório');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word());
    Helpers.testInputStatus('email', 'Valor inválido');
    cy.getByTestId('password').focus().type(faker.internet.password(3));
    Helpers.testInputStatus('password', 'Valor inválido');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    populateFields();

    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error if invalid credentials are provided', () => {
    Interceptor.mockUnauthorized(/login/);
    simulateValidSubmit();

    Helpers.testMainError('Invalid Credentials');
    Helpers.testUrl('/login');
  });

  it('Should present UnexpectedError on any other error', () => {
    Interceptor.mockCustomErrors('POST', /login/, [400, 404, 500]);
    simulateValidSubmit();

    Helpers.testMainError('Something wrong happened. Try again.');
    Helpers.testUrl('/login');
  });

  it('Should save account if valid credentials are provided', () => {
    const account = Helpers.mockAccount();
    Interceptor.mockOk('POST', /login/, account);
    simulateValidSubmit();

    cy.getByTestId('main-error').should('not.exist');
    cy.getByTestId('spinner').should('not.exist');
    Helpers.testUrl('/');
    Helpers.testLocalStorage('account', JSON.stringify(account));
  });

  it('Should prevent multiple submits', () => {
    const mockOk = Interceptor.mockOk('POST', /login/, Helpers.mockAccount());
    populateFields();

    cy.getByTestId('submit')
      .dblclick()
      .then(() => mockOk.testCount(1));
  });

  it('Should not submit if form is invalid', () => {
    const mockOk = Interceptor.mockOk('POST', /login/, Helpers.mockAccount());
    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .type('{enter}')
      .then(() => mockOk.testCount(0));
  });
});
