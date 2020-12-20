import React from 'react';
import faker from 'faker';
import { fireEvent, render, RenderResult } from '@testing-library/react';

import Input from './input';

const makeSut = (fieldName: string): RenderResult =>
  render(
    <Input
      name={fieldName}
      state={{
        formData: {},
        formErrors: {},
      }}
      setState={() => {}}
    />,
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
