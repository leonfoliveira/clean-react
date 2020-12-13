import React from 'react';
import { render, RenderResult, cleanup, fireEvent } from '@testing-library/react';
import faker from 'faker';

import { ValidationStub } from '@/presentation/mocks';

import Login from './login';

type SutTypes = {
  sut: RenderResult;
  validationStub: ValidationStub;
};

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub();
  validationStub.errorMessage = faker.random.words();

  const sut = render(<Login validation={validationStub} />);

  return { sut, validationStub };
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should start with initial state', () => {
    const { sut, validationStub } = makeSut();
    const errorWrap = sut.getByTestId('error-wrap');
    const submitButon = sut.getByTestId('submit') as HTMLButtonElement;
    const emailStatus = sut.getByTestId('email-status');
    const passwordStatus = sut.getByTestId('password-status');

    expect(errorWrap.childElementCount).toBe(0);
    expect(submitButon.disabled).toBe(true);
    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should show email error if Validator fails', () => {
    const { sut, validationStub } = makeSut();
    const emailInput = sut.getByTestId('email');
    const emailStatus = sut.getByTestId('email-status');

    fireEvent.input(emailInput, { target: { value: faker.internet.email() } });

    expect(emailStatus.title).toBe(validationStub.errorMessage);
    expect(emailStatus.textContent).toBe('🔴');
  });

  test('Should show password error if Validator fails', () => {
    const { sut, validationStub } = makeSut();
    const passwordInput = sut.getByTestId('password');
    const passwordStatus = sut.getByTestId('password-status');

    fireEvent.input(passwordInput, { target: { value: faker.internet.password() } });

    expect(validationStub.fieldName).toEqual('password');
    expect(passwordStatus.title).toBe(validationStub.errorMessage);
    expect(passwordStatus.textContent).toBe('🔴');
  });
});
