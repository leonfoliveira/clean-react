import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import faker from 'faker';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';

import { Helper, ValidationStub, RegistrationSpy } from '@/presentation/test';
import { EmailInUseError } from '@/domain/errors';

import { AccountModel } from '@/domain/models';
import { ApiContext } from '@/presentation/contexts';
import Signup from './signup';

type SutTypes = {
  registrationSpy: RegistrationSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/signup'] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const registrationSpy = new RegistrationSpy();
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => null }}
    >
      <Router history={history}>
        <Signup validation={validationStub} registration={registrationSpy} />
      </Router>
    </ApiContext.Provider>,
  );

  return { registrationSpy, setCurrentAccountMock };
};

const simulateValidSubmit = async (
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
): Promise<void> => {
  Helper.populateField('name', name);
  Helper.populateField('email', email);
  Helper.populateField('password', password);
  Helper.populateField('passwordConfirmation', password);

  const form = screen.getByTestId('form');
  fireEvent.submit(form);
  await waitFor(() => form);
};

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    Helper.testChildCount('error-wrap', 0);
    Helper.testButtonIsDisabled('submit', true);
    Helper.testStatusForField('name', validationError);
    Helper.testStatusForField('email', validationError);
    Helper.testStatusForField('password', validationError);
    Helper.testStatusForField('passwordConfirmation', validationError);
  });

  test('Should show name error if Validator fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    Helper.populateField('name');

    Helper.testStatusForField('name', validationError);
  });

  test('Should show email error if Validator fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    Helper.populateField('email');

    Helper.testStatusForField('email', validationError);
  });

  test('Should show password error if Validator fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    Helper.populateField('password');

    Helper.testStatusForField('password', validationError);
  });

  test('Should show passwordConfirmation error if Validator fails', () => {
    const validationError = faker.random.words();
    makeSut({ validationError });

    Helper.populateField('passwordConfirmation');

    Helper.testStatusForField('passwordConfirmation', validationError);
  });

  test('Should show valid name state if Validator succeeds', () => {
    makeSut();

    Helper.populateField('name');

    Helper.testStatusForField('name');
  });

  test('Should show valid email state if Validator succeeds', () => {
    makeSut();

    Helper.populateField('email');

    Helper.testStatusForField('email');
  });

  test('Should show valid password state if Validator succeeds', () => {
    makeSut();

    Helper.populateField('password');

    Helper.testStatusForField('password');
  });

  test('Should show valid passwordConfirmation state if Validator succeeds', () => {
    makeSut();

    Helper.populateField('passwordConfirmation');

    Helper.testStatusForField('passwordConfirmation');
  });

  test('Should enable submit button if form is valid', () => {
    makeSut();

    Helper.populateField('name');
    Helper.populateField('email');
    Helper.populateField('password');
    Helper.populateField('passwordConfirmation');

    Helper.testButtonIsDisabled('submit', false);
  });

  test('Should show spinner on submit', async () => {
    makeSut();

    await simulateValidSubmit();

    Helper.testElementExists('spinner');
  });

  test('Should call Registration with correct values', async () => {
    const { registrationSpy } = makeSut();
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(name, email, password);

    expect(registrationSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
  });

  test('Should call Registration only once', async () => {
    const { registrationSpy } = makeSut();
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(name, email, password);
    await simulateValidSubmit(name, email, password);

    expect(registrationSpy.callsCount).toBe(1);
  });

  test('Should not call Registration if form is invalid', async () => {
    const validationError = faker.random.words();
    const { registrationSpy } = makeSut({ validationError });

    await simulateValidSubmit();

    expect(registrationSpy.callsCount).toBe(0);
  });

  test('Should present error if Authentication fails', async () => {
    const { registrationSpy } = makeSut();
    const error = new EmailInUseError();

    jest.spyOn(registrationSpy, 'register').mockRejectedValueOnce(error);
    await simulateValidSubmit();

    Helper.testElementText('main-error', error.message);
    Helper.testChildCount('error-wrap', 1);
  });

  test('Should call UpdateCurrentAccount on success', async () => {
    const { registrationSpy, setCurrentAccountMock } = makeSut();

    await simulateValidSubmit();

    expect(setCurrentAccountMock).toHaveBeenCalledWith(registrationSpy.account);
    expect(history.location.pathname).toBe('/');
  });

  test('Should go to login page', async () => {
    makeSut();
    const loginLink = screen.getByTestId('login-link');

    fireEvent.click(loginLink);

    expect(history.location.pathname).toBe('/login');
  });
});
