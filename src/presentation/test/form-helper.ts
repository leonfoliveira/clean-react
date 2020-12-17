import faker from 'faker';
import { fireEvent, screen } from '@testing-library/react';

export const populateField = (fieldName: string, value = faker.random.word()): void => {
  const input = screen.getByTestId(fieldName);
  fireEvent.input(input, { target: { value } });
};

export const testChildCount = (fieldName: string, count: number) => {
  const el = screen.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

export const testButtonIsDisabled = (fieldName: string, isDisabled: boolean) => {
  const button = screen.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const testStatusForField = (fieldName: string, validationError: string = null) => {
  const wrap = screen.getByTestId(`${fieldName}-wrap`);
  const label = screen.getByTestId(`${fieldName}-label`);
  expect(wrap.getAttribute('data-status')).toBe(validationError ? 'invalid' : 'valid');
  expect(label.getAttribute('title')).toBe(validationError);
};

export const testElementExists = (fieldName: string) => {
  const el = screen.getByTestId(fieldName);
  expect(el).toBeTruthy();
};

export const testElementText = (fieldName: string, text: string) => {
  const el = screen.getByTestId(fieldName);
  expect(el.textContent).toBe(text);
};
