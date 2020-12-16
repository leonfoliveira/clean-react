import faker from 'faker';

import * as FormHelper from '../support/form-helper';
import { Interceptor } from '../support/interceptor';

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
    cy.getByTestId('name').focus().type(faker.random.words());
    FormHelper.testInputStatus('name');
    cy.getByTestId('email').focus().type(faker.internet.email());
    FormHelper.testInputStatus('email');
    const password = faker.internet.password(5);
    cy.getByTestId('password').focus().type(password);
    FormHelper.testInputStatus('password');
    cy.getByTestId('passwordConfirmation').focus().type(password);
    FormHelper.testInputStatus('passwordConfirmation');

    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error if email is already in use', () => {
    Interceptor.mockEmailInUseError(/signup/);

    cy.getByTestId('name').focus().type(faker.random.words());
    cy.getByTestId('email').focus().type(faker.internet.email());
    const password = faker.internet.password(5);
    cy.getByTestId('password').focus().type(password);
    cy.getByTestId('passwordConfirmation').focus().type(password);

    cy.getByTestId('submit').click();
    FormHelper.testMainError('This email is already in use');
    FormHelper.testUrl('/signup');
  });

  it('Should present UnexpectedError on any other error', () => {
    Interceptor.mockUnexpectedError('POST', /signup/);

    cy.getByTestId('name').focus().type(faker.random.words());
    cy.getByTestId('email').focus().type(faker.internet.email());
    const password = faker.internet.password(5);
    cy.getByTestId('password').focus().type(password);
    cy.getByTestId('passwordConfirmation').focus().type(password);

    cy.getByTestId('submit').click();
    FormHelper.testMainError('Something wrong happened. Try again.');
    FormHelper.testUrl('/signup');
  });

  it('Should present UnexpectedError if invalid data is returned', () => {
    Interceptor.mockOk('POST', /signup/, { invalidProperty: faker.random.uuid() });

    cy.getByTestId('name').focus().type(faker.random.words());
    cy.getByTestId('email').focus().type(faker.internet.email());
    const password = faker.internet.password(5);
    cy.getByTestId('password').focus().type(password);
    cy.getByTestId('passwordConfirmation').focus().type(password);

    cy.getByTestId('submit').click();
    FormHelper.testMainError('Something wrong happened. Try again.');
    FormHelper.testUrl('/signup');
  });

  it('Should present save accessToken if valid credentials are provided', () => {
    const accessToken = faker.random.uuid();
    Interceptor.mockOk('POST', /signup/, { accessToken });

    cy.getByTestId('name').focus().type(faker.random.words());
    cy.getByTestId('email').focus().type(faker.internet.email());
    const password = faker.internet.password(5);
    cy.getByTestId('password').focus().type(password);
    cy.getByTestId('passwordConfirmation').focus().type(password);

    cy.getByTestId('submit').click();
    cy.getByTestId('main-error').should('not.exist');
    cy.getByTestId('spinner').should('not.exist');
    FormHelper.testUrl('/');
    cy.window().then((window) =>
      assert.deepEqual(window.localStorage.getItem('accessToken'), accessToken),
    );
  });

  it('Should prevent multiple submits', () => {
    const mockOk = Interceptor.mockOk('POST', /signup/, { accessToken: faker.random.uuid() });

    cy.getByTestId('name').focus().type(faker.random.words());
    cy.getByTestId('email').focus().type(faker.internet.email());
    const password = faker.internet.password(5);
    cy.getByTestId('password').focus().type(password);
    cy.getByTestId('passwordConfirmation').focus().type(password);

    cy.getByTestId('submit')
      .dblclick()
      .then(() => mockOk.testCount(1));
  });
});
