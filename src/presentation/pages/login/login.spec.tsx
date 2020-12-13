import React from 'react';
import { render, RenderResult, cleanup, fireEvent } from '@testing-library/react';
import faker from 'faker';

import { ValidationStub } from '@/presentation/mocks';

import Login from './login';

type SutTypes = {
  sut: RenderResult;
};

type SutParams = {
  validationError: string;
};

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = params?.validationError;
  const sut = render(<Login validation={validationStub} />);

  return { sut };
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should start with initial state', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    const errorWrap = sut.getByTestId('error-wrap');
    const submitButon = sut.getByTestId('submit') as HTMLButtonElement;
    const emailStatus = sut.getByTestId('email-status');
    const passwordStatus = sut.getByTestId('password-status');

    expect(errorWrap.childElementCount).toBe(0);
    expect(submitButon.disabled).toBe(true);
    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');
    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show email error if Validator fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    const emailInput = sut.getByTestId('email');
    const emailStatus = sut.getByTestId('email-status');

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    expect(emailStatus.title).toBe(validationError);
    expect(emailStatus.textContent).toBe('🔴');
  });

  test('Should show password error if Validator fails', () => {
    const validationError = faker.random.words();
    const { sut } = makeSut({ validationError });
    const passwordInput = sut.getByTestId('password');
    const passwordStatus = sut.getByTestId('password-status');

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    expect(passwordStatus.title).toBe(validationError);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show valid email state if Validator succeeds', () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId('email');
    const emailStatus = sut.getByTestId('email-status');

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    expect(emailStatus.title).toBe('Tudo Certo!');
    expect(emailStatus.textContent).toBe('🟢');
  });

  test('Should show valid password state if Validator succeeds', () => {
    const { sut } = makeSut();
    const passwordInput = sut.getByTestId('password');
    const passwordStatus = sut.getByTestId('password-status');

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    expect(passwordStatus.title).toBe('Tudo Certo!');
    expect(passwordStatus.textContent).toBe('🟢');
  });

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut();
    const emailInput = sut.getByTestId('email');
    const passwordInput = sut.getByTestId('password');
    const submitButon = sut.getByTestId('submit') as HTMLButtonElement;

    fireEvent.input(emailInput, { target: { value: faker.internet.password() } });
    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    expect(submitButon.disabled).toBe(false);
  });
});
