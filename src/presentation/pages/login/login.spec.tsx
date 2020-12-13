import React from 'react';
import { render, RenderResult, cleanup, fireEvent } from '@testing-library/react';

import { Validation } from '@/presentation/protocols/validation';

import Login from './login';

type SutTypes = {
  sut: RenderResult;
  validationSpy: ValidationSpy;
};

class ValidationSpy implements Validation {
  errorMessage: string;

  input: object;

  validate(input: object): string {
    this.input = input;

    return this.errorMessage;
  }
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy();
  const sut = render(<Login validation={validationSpy} />);

  return { sut, validationSpy };
};

describe('Login Component', () => {
  afterEach(cleanup);

  test('Should start with initial state', () => {
    const { sut } = makeSut();

    const errorWrap = sut.getByTestId('error-wrap');
    const submitButon = sut.getByTestId('submit') as HTMLButtonElement;
    const emailStatus = sut.getByTestId('email-status');
    const passwordStatus = sut.getByTestId('password-status');

    expect(errorWrap.childElementCount).toBe(0);
    expect(submitButon.disabled).toBe(true);
    expect(emailStatus.title).toBe('Campo obrigatório');
    expect(emailStatus.textContent).toBe('🔴');
    expect(passwordStatus.title).toBe('Campo obrigatório');
    expect(passwordStatus.textContent).toBe('🔴');
  });

  test('Should call Validation with correct email', () => {
    const { sut, validationSpy } = makeSut();

    const emailInput = sut.getByTestId('email');
    fireEvent.input(emailInput, { target: { value: 'any_email' } });

    expect(validationSpy.input).toEqual({
      email: 'any_email',
    });
  });
});
