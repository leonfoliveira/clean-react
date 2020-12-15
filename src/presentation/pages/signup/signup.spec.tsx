import React from 'react';
import { render, RenderResult } from '@testing-library/react';

import Signup from './signup';

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<Signup />);

  return { sut };
};

const testChildCount = (sut: RenderResult, fieldName: string, count: number) => {
  const el = sut.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean) => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string) => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || 'Tudo Certo!');
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = 'Campo Obrigatório';
    const { sut } = makeSut();

    testChildCount(sut, 'error-wrap', 0);
    testButtonIsDisabled(sut, 'submit', true);
    testStatusForField(sut, 'name', validationError);
    testStatusForField(sut, 'email', validationError);
    testStatusForField(sut, 'password', validationError);
    testStatusForField(sut, 'passwordConfirmation', validationError);
  });
});
