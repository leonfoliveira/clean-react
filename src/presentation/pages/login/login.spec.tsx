import React from 'react';
import { render, RenderResult } from '@testing-library/react';

import Login from './login';

type SutTypes = {
  sut: RenderResult;
};

const makeSut = (): SutTypes => {
  const sut = render(<Login />);

  return { sut };
};

describe('Login Component', () => {
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
});
