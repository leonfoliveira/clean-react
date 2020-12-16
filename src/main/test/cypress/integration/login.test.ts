import faker from 'faker';

import * as FormHelper from '../support/form-helper';
import { Interceptor } from '../support/interceptor';

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login');
  });

  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('email', 'Campo Obrigatório');

    cy.getByTestId('password').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('password', 'Campo Obrigatório');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word());
    FormHelper.testInputStatus('email', 'Valor inválido');

    cy.getByTestId('password').focus().type(faker.internet.password(3));
    FormHelper.testInputStatus('password', 'Valor inválido');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email());
    FormHelper.testInputStatus('email');

    cy.getByTestId('password').focus().type(faker.internet.password(5));
    FormHelper.testInputStatus('password');

    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error if invalid credentials are provided', () => {
    Interceptor.mockUnauthorized(/login/);

    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));

    cy.getByTestId('submit').click();
    FormHelper.testMainError('Invalid Credentials');
    FormHelper.testUrl('/login');
  });

  it('Should present UnexpectedError on any other error', () => {
    Interceptor.mockCustomErrors('POST', /login/, [400, 404, 500]);

    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));

    cy.getByTestId('submit').click();
    FormHelper.testMainError('Something wrong happened. Try again.');
    FormHelper.testUrl('/login');
  });

  it('Should present UnexpectedError if invalid data is returned', () => {
    Interceptor.mockOk('POST', /login/, { invalidProperty: faker.random.uuid() });

    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));

    cy.getByTestId('submit').click();
    FormHelper.testMainError('Something wrong happened. Try again.');
    FormHelper.testUrl('/login');
  });

  it('Should present save accessToken if valid credentials are provided', () => {
    const accessToken = faker.random.uuid();
    Interceptor.mockOk('POST', /login/, { accessToken });

    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));

    cy.getByTestId('submit').click();
    cy.getByTestId('main-error').should('not.exist');
    cy.getByTestId('spinner').should('not.exist');
    FormHelper.testUrl('/');
    cy.window().then((window) =>
      assert.deepEqual(window.localStorage.getItem('accessToken'), accessToken),
    );
  });

  it('Should prevent multiple submits', () => {
    const mockOk = Interceptor.mockOk('POST', /login/, { accessToken: faker.random.uuid() });

    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));

    cy.getByTestId('submit')
      .dblclick()
      .then(() => mockOk.testCount(1));
  });

  it('Should not submit if form is invalid', () => {
    const mockOk = Interceptor.mockOk('POST', /login/, { accessToken: faker.random.uuid() });
    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .type('{enter}')
      .then(() => mockOk.testCount(0));
  });
});
