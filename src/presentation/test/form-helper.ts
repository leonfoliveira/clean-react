import faker from 'faker';
import { fireEvent, screen } from '@testing-library/react';

export const populateField = (fieldName: string, value = faker.random.word()): void => {
  const input = screen.getByTestId(fieldName);
  fireEvent.input(input, { target: { value } });
};

export const testStatusForField = (fieldName: string, validationError: string = '') => {
  const wrap = screen.getByTestId(`${fieldName}-wrap`);
  const label = screen.getByTestId(`${fieldName}-label`);
  expect(wrap).toHaveAttribute('data-status', validationError ? 'invalid' : 'valid');
  expect(label).toHaveProperty('title', validationError);
};
