import React from 'react';
import { render, RenderResult, cleanup, fireEvent } from '@testing-library/react';
import faker from 'faker';

import { AuthenticationSpy } from '@/presentation/mocks/mock-authentication';
import { ValidationStub } from '@/presentation/mocks';

import Login from './login';

type SutTypes = {
  sut: RenderResult;
  authenticationSpy: AuthenticationSpy;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  const authenticationSpy = new AuthenticationSpy();
  validationStub.errorMessage = params?.validationError;
  const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />);

  return { sut, authenticationSpy };
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const errorWrap = sut.getByTestId('error-wrap');
    expect(errorWrap.childElementCount).toBe(0);

    const submitButon = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButon.disabled).toBe(true);

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');

    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show email error if Validator fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');
  });

  test('Should show password error if Validator fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });

    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show valid email state if Validator succeeds', () => {
    const { sut } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    const emailStatus = sut.getByTestId('email-status');
    expect(emailStatus.title).toBe('Tudo Certo!');
    expect(emailStatus.textContent).toBe('🟢');
  });

  test('Should show valid password state if Validator succeeds', () => {
    const { sut } = makeSut();

    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const passwordStatus = sut.getByTestId('password-status');
    expect(passwordStatus.title).toBe('Tudo Certo!');
    expect(passwordStatus.textContent).toBe('🟢');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const submitButon = sut.getByTestId('submit') as HTMLButtonElement;
    expect(submitButon.disabled).toBe(false);
  });

  test('Should show spinner on submit', () => {
    const { sut } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    const passwordInput = sut.getByTestId('password');
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    const submitButon = sut.getByTestId('submit') as HTMLButtonElement;
    fireEvent.click(submitButon);

    const spinner = sut.getByTestId('spinner');
    expect(spinner).toBeTruthy();
  });

  test('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut();

    const emailInput = sut.getByTestId('email');
    const email = faker.internet.email();
    fireEvent.input(emailInput, { target: { value: email } });

    const passwordInput = sut.getByTestId('password');
    const password = faker.internet.password();
    fireEvent.input(passwordInput, { target: { value: password } });

    const submitButon = sut.getByTestId('submit') as HTMLButtonElement;
    fireEvent.click(submitButon);

    expect(authenticationSpy.params).toEqual({ email, password });
  });
});
