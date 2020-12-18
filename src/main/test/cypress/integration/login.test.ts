import faker from 'faker';

import * as Helpers from '../utils/helpers';
import { Interceptor } from '../utils/interceptor';

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

const path = /login/;
const mockInvalidCredentialsError = () => Interceptor.mockUnauthorized(path);
const mockUnexpectedError = () => Interceptor.mockCustomErrors('POST', path, [400, 404, 500]);
const mockSuccess = () => Interceptor.mockOk('POST', path, { fixture: 'account' });

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
    mockInvalidCredentialsError();
    simulateValidSubmit();

    Helpers.testMainError('Invalid Credentials');
    Helpers.testUrl('/login');
  });

  it('Should present UnexpectedError on any other error', () => {
    mockUnexpectedError();
    simulateValidSubmit();

    Helpers.testMainError('Something wrong happened. Try again.');
    Helpers.testUrl('/login');
  });

  it('Should save account if valid credentials are provided', () => {
    mockSuccess();
    simulateValidSubmit();

    cy.getByTestId('main-error').should('not.exist');
    cy.getByTestId('spinner').should('not.exist');
    Helpers.testUrl('/');
    Helpers.testLocalStorageItem('account');
  });

  it('Should prevent multiple submits', () => {
    const interceptor = mockSuccess();
    populateFields();

    cy.getByTestId('submit')
      .dblclick()
      .then(() => interceptor.testCount(1));
  });

  it('Should not submit if form is invalid', () => {
    const interceptor = mockSuccess();
    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .type('{enter}')
      .then(() => interceptor.testCount(0));
  });
});
