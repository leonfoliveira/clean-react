import React from 'react';
import faker from 'faker';
import { fireEvent, render, RenderResult } from '@testing-library/react';
import Context from '@/presentation/contexts/form/form-context';

import Input from './input';

const makeSut = (fieldName: string): RenderResult =>
  render(
    <Context.Provider
      value={{
        state: {
          isLoading: false,
          mainError: '',
          formDate: {
            email: '',
            password: '',
          },
          formErrors: {
            emailError: '',
            passwordError: '',
          },
        },
        setState: () => {},
      }}
    >
      <Input name={fieldName} />
    </Context.Provider>,
  );

describe('Input Component', () => {
  test('Should begin with read only', () => {
    const field = faker.database.column();
    const { getByTestId } = makeSut(field);

    const input = getByTestId(field) as HTMLInputElement;

    expect(input.readOnly).toBe(true);
  });

  test('Should remove readOnly on focus', () => {
    const field = faker.database.column();
    const { getByTestId } = makeSut(field);

    const input = getByTestId(field) as HTMLInputElement;
    fireEvent.focus(input);

    expect(input.readOnly).toBe(false);
  });
});
