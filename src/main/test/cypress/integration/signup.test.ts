import faker from 'faker';

import * as Helpers from '../support/helpers';
import { Interceptor } from '../support/interceptor';

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
    Interceptor.mockForbidden('POST', /signup/);
    simulateValidSubmit();

    Helpers.testMainError('This email is already in use');
    Helpers.testUrl('/signup');
  });

  it('Should present UnexpectedError on any other error', () => {
    Interceptor.mockCustomErrors('POST', /signup/, [400, 404, 500]);
    simulateValidSubmit();

    Helpers.testMainError('Something wrong happened. Try again.');
    Helpers.testUrl('/signup');
  });

  it('Should save account if valid credentials are provided', () => {
    const account = Helpers.mockAccount();
    Interceptor.mockOk('POST', /signup/, account);
    simulateValidSubmit();

    cy.getByTestId('main-error').should('not.exist');
    cy.getByTestId('spinner').should('not.exist');
    Helpers.testUrl('/');
    cy.window().then((window) =>
      assert.deepEqual(window.localStorage.getItem('account'), JSON.stringify(account)),
    );
  });

  it('Should prevent multiple submits', () => {
    const mockOk = Interceptor.mockOk('POST', /signup/, Helpers.mockAccount());
    populateFields();

    cy.getByTestId('submit')
      .dblclick()
      .then(() => mockOk.testCount(1));
  });

  it('Should not submit if form is invalid', () => {
    const mockOk = Interceptor.mockOk('POST', /signup/, Helpers.mockAccount());
    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .type('{enter}')
      .then(() => mockOk.testCount(0));
  });
});
