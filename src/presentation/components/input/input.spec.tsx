import React from 'react';
import { render } from '@testing-library/react';
import Context from '@/presentation/contexts/login-form-context';

import Input from './input';

describe('Input Component', () => {
  test('Should begin with read only', () => {
    const { getByTestId } = render(
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
    const input = getByTestId('field') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });
});
