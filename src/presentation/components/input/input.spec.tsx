import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import Context from '@/presentation/contexts/login-form-context';

import Input from './input';

const makeSut = (): RenderResult =>
  render(
    <Context.Provider
      value={{
        state: {
          isLoading: false,
          email: '',
          emailError: '',
          password: '',
          passwordError: '',
          mainError: '',
        },
        setState: () => {},
      }}
    >
      <Input name="field" />
    </Context.Provider>,
  );

describe('Input Component', () => {
  test('Should begin with read only', () => {
    const { getByTestId } = makeSut();

    const input = getByTestId('field') as HTMLInputElement;

    expect(input.readOnly).toBe(true);
  });

  test('Should begin with read only', () => {
    const { getByTestId } = makeSut();

    const input = getByTestId('field') as HTMLInputElement;

    expect(input.readOnly).toBe(true);
  });
});
