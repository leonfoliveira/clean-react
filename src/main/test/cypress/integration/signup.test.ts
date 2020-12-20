import faker from 'faker';

import * as Helpers from '../utils/helpers';
import { Interceptor } from '../utils/interceptor';

const populateFields = (): void => {
  cy.getByTestId('name').focus().type(faker.random.words());
  Helpers.testInputStatus('name');
  cy.getByTestId('email').focus().type(faker.internet.email());
  Helpers.testInputStatus('email');
  const password = faker.internet.password(5);
  cy.getByTestId('password').focus().type(password);
  Helpers.testInputStatus('password');
  cy.getByTestId('passwordConfirmation').focus().type(password);
  Helpers.testInputStatus('passwordConfirmation');
};

const simulateValidSubmit = (): void => {
  populateFields();
  cy.getByTestId('submit').click();
};

const path = /signup/;
const mockEmailInUseError = () => Interceptor.mockForbidden('POST', path);
const mockUnexpectedError = () => Interceptor.mockCustomErrors('POST', path, [400, 404, 500]);
const mockSuccess = () => Interceptor.mockOk('POST', path, { fixture: 'account' });

describe('Signup', () => {
  beforeEach(() => {
    cy.visit('signup');
  });

  it('Should load with correct initial state', () => {
    cy.getByTestId('name').should('have.attr', 'readOnly');
    Helpers.testInputStatus('email', 'Campo Obrigatório');
    cy.getByTestId('email').should('have.attr', 'readOnly');
    Helpers.testInputStatus('email', 'Campo Obrigatório');
    cy.getByTestId('password').should('have.attr', 'readOnly');
    Helpers.testInputStatus('password', 'Campo Obrigatório');
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly');
    Helpers.testInputStatus('password', 'Campo Obrigatório');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should reset state on page signup', () => {
    cy.getByTestId('email').focus().type(faker.internet.email());
    Helpers.testInputStatus('email');
    cy.getByTestId('login-link').click();
    cy.getByTestId('signup-link').click();
    Helpers.testInputStatus('email', 'Campo Obrigatório');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word());
    Helpers.testInputStatus('email', 'Valor inválido');
    cy.getByTestId('password').focus().type(faker.internet.password(3));
    Helpers.testInputStatus('password', 'Valor inválido');
    cy.getByTestId('passwordConfirmation').focus().type(faker.internet.password(3));
    Helpers.testInputStatus('passwordConfirmation', 'Valor inválido');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    populateFields();

    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error if email is already in use', () => {
    mockEmailInUseError();
    simulateValidSubmit();

    Helpers.testMainError('This email is already in use');
    Helpers.testUrl('/signup');
  });

  it('Should present UnexpectedError on any other error', () => {
    mockUnexpectedError();
    simulateValidSubmit();

    Helpers.testMainError('Something wrong happened. Try again.');
    Helpers.testUrl('/signup');
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
