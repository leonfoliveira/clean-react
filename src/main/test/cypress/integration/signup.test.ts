import faker from 'faker';

import * as FormHelper from '../support/form-helper';
import { Interceptor } from '../support/interceptor';

const populateFields = (): void => {
  cy.getByTestId('name').focus().type(faker.random.words());
  FormHelper.testInputStatus('name');
  cy.getByTestId('email').focus().type(faker.internet.email());
  FormHelper.testInputStatus('email');
  const password = faker.internet.password(5);
  cy.getByTestId('password').focus().type(password);
  FormHelper.testInputStatus('password');
  cy.getByTestId('passwordConfirmation').focus().type(password);
  FormHelper.testInputStatus('passwordConfirmation');
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
    FormHelper.testInputStatus('email', 'Campo Obrigatório');
    cy.getByTestId('email').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('email', 'Campo Obrigatório');
    cy.getByTestId('password').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('password', 'Campo Obrigatório');
    cy.getByTestId('passwordConfirmation').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('password', 'Campo Obrigatório');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word());
    FormHelper.testInputStatus('email', 'Valor inválido');
    cy.getByTestId('password').focus().type(faker.internet.password(3));
    FormHelper.testInputStatus('password', 'Valor inválido');
    cy.getByTestId('passwordConfirmation').focus().type(faker.internet.password(3));
    FormHelper.testInputStatus('passwordConfirmation', 'Valor inválido');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    populateFields();

    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error if email is already in use', () => {
    Interceptor.mockForbidden(/signup/);
    simulateValidSubmit();

    FormHelper.testMainError('This email is already in use');
    FormHelper.testUrl('/signup');
  });

  it('Should present UnexpectedError on any other error', () => {
    Interceptor.mockCustomErrors('POST', /signup/, [400, 404, 500]);
    simulateValidSubmit();

    FormHelper.testMainError('Something wrong happened. Try again.');
    FormHelper.testUrl('/signup');
  });

  it('Should present UnexpectedError if invalid data is returned', () => {
    Interceptor.mockOk('POST', /signup/, { invalidProperty: faker.random.uuid() });
    simulateValidSubmit();

    FormHelper.testMainError('Something wrong happened. Try again.');
    FormHelper.testUrl('/signup');
  });

  it('Should save account if valid credentials are provided', () => {
    const account = FormHelper.mockAccount();
    Interceptor.mockOk('POST', /signup/, account);
    simulateValidSubmit();

    cy.getByTestId('main-error').should('not.exist');
    cy.getByTestId('spinner').should('not.exist');
    FormHelper.testUrl('/');
    cy.window().then((window) =>
      assert.deepEqual(window.localStorage.getItem('account'), JSON.stringify(account)),
    );
  });

  it('Should prevent multiple submits', () => {
    const mockOk = Interceptor.mockOk('POST', /signup/, FormHelper.mockAccount());
    populateFields();

    cy.getByTestId('submit')
      .dblclick()
      .then(() => mockOk.testCount(1));
  });

  it('Should not submit if form is invalid', () => {
    const mockOk = Interceptor.mockOk('POST', /signup/, FormHelper.mockAccount());
    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .type('{enter}')
      .then(() => mockOk.testCount(0));
  });
});
