import React from 'react';
import { render } from '@testing-library/react';

import Login from './login';

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const { getByTestId } = render(<Login />);

    const errorWrap = getByTestId('error-wrap');
    const submitButon = getByTestId('submit') as HTMLButtonElement;

    expect(errorWrap.childElementCount).toBe(0);
    expect(submitButon.disabled).toBe(true);
  });
});
