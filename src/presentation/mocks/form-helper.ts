import faker from 'faker';
import { fireEvent, RenderResult } from '@testing-library/react';

export const populateField = (
  sut: RenderResult,
  fieldName: string,
  value = faker.random.word(),
): void => {
  const input = sut.getByTestId(fieldName);
  fireEvent.input(input, { target: { value } });
};

export const testChildCount = (sut: RenderResult, fieldName: string, count: number) => {
  const el = sut.getByTestId(fieldName);
  expect(el.childElementCount).toBe(count);
};

export const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean) => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement;
  expect(button.disabled).toBe(isDisabled);
};

export const testStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string,
) => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`);
  expect(fieldStatus.title).toBe(validationError || 'Tudo Certo!');
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢');
};
