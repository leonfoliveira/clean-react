import React from 'react';
import { Router } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';
import faker from 'faker';
import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react';

import { Helper, ValidationStub, RegistrationSpy, SaveAccessTokenMock } from '@/presentation/mocks';
import { EmailInUseError } from '@/domain/errors';

import Signup from './signup';

type SutTypes = {
  sut: RenderResult;
  registrationSpy: RegistrationSpy;
  saveAccessTokenMock: SaveAccessTokenMock;
};

type SutParams = {
  validationError: string;
};

const history = createMemoryHistory({ initialEntries: ['/signup'] });
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const registrationSpy = new RegistrationSpy();
  const saveAccessTokenMock = new SaveAccessTokenMock();
  const sut = render(
    <Router history={history}>
      <Signup
        validation={validationStub}
        registration={registrationSpy}
        saveAccessToken={saveAccessTokenMock}
      />
    </Router>,
  );

  return { sut, registrationSpy, saveAccessTokenMock };
};

const simulateValidSubmit = async (
  sut: RenderResult,
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
): Promise<void> => {
  Helper.populateField(sut, 'name', name);
  Helper.populateField(sut, 'email', email);
  Helper.populateField(sut, 'password', password);
  Helper.populateField(sut, 'passwordConfirmation', password);

  const form = sut.getByTestId('form');
  fireEvent.submit(form);
  await waitFor(() => form);
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    Helper.testChildCount(sut, 'error-wrap', 0);
    Helper.testButtonIsDisabled(sut, 'submit', true);
    Helper.testStatusForField(sut, 'name', validationError);
    Helper.testStatusForField(sut, 'email', validationError);
    Helper.testStatusForField(sut, 'password', validationError);
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
  });

  test('Should show name error if Validator fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'name');

    Helper.testStatusForField(sut, 'name', validationError);
  });

  test('Should show email error if Validator fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'email');

    Helper.testStatusForField(sut, 'email', validationError);
  });

  test('Should show password error if Validator fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'password');

    Helper.testStatusForField(sut, 'password', validationError);
  });

  test('Should show passwordConfirmation error if Validator fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    Helper.populateField(sut, 'passwordConfirmation');

    Helper.testStatusForField(sut, 'passwordConfirmation', validationError);
  });

  test('Should show valid name state if Validator succeeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'name');

    Helper.testStatusForField(sut, 'name');
  });

  test('Should show valid email state if Validator succeeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'email');

    Helper.testStatusForField(sut, 'email');
  });

  test('Should show valid password state if Validator succeeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'password');

    Helper.testStatusForField(sut, 'password');
  });

  test('Should show valid passwordConfirmation state if Validator succeeds', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'passwordConfirmation');

    Helper.testStatusForField(sut, 'passwordConfirmation');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    Helper.populateField(sut, 'name');
    Helper.populateField(sut, 'email');
    Helper.populateField(sut, 'password');
    Helper.populateField(sut, 'passwordConfirmation');

    Helper.testButtonIsDisabled(sut, 'submit', false);
  });

  test('Should show spinner on submit', async () => {
    const { sut } = makeSut();

    await simulateValidSubmit(sut);

    Helper.testElementExists(sut, 'spinner');
  });

  test('Should call Registration with correct values', async () => {
    const { sut, registrationSpy } = makeSut();
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(sut, name, email, password);

    expect(registrationSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password,
    });
  });

  test('Should call Registration only once', async () => {
    const { sut, registrationSpy } = makeSut();
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    await simulateValidSubmit(sut, name, email, password);
    await simulateValidSubmit(sut, name, email, password);

    expect(registrationSpy.callsCount).toBe(1);
  });

  test('Should not call Registration if form is invalid', async () => {
    const validationError = faker.random.words();
    const { sut, registrationSpy } = makeSut({ validationError });

    await simulateValidSubmit(sut);

    expect(registrationSpy.callsCount).toBe(0);
  });

  test('Should present error if Authentication fails', async () => {
    const { sut, registrationSpy } = makeSut();
    const error = new EmailInUseError();

    jest.spyOn(registrationSpy, 'register').mockRejectedValueOnce(error);
    await simulateValidSubmit(sut);

    Helper.testElementText(sut, 'main-error', error.message);
    Helper.testChildCount(sut, 'error-wrap', 1);
  });

  test('Should call SaveAccessToken on success', async () => {
    const { sut, registrationSpy, saveAccessTokenMock } = makeSut();

    await simulateValidSubmit(sut);

    expect(saveAccessTokenMock.accessToken).toBe(registrationSpy.account.accessToken);
    expect(history.length).toBe(1);
    expect(history.location.pathname).toBe('/');
  });

  test('Should present error if SaveAccessToken fails', async () => {
    const { sut, saveAccessTokenMock } = makeSut();
    const error = new EmailInUseError();

    jest.spyOn(saveAccessTokenMock, 'save').mockRejectedValueOnce(error);
    await simulateValidSubmit(sut);

    Helper.testElementText(sut, 'main-error', error.message);
    Helper.testChildCount(sut, 'error-wrap', 1);
  });
});
