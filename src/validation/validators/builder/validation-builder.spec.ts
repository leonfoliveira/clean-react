import { RequiredFieldValidation } from '@/validation/validators';
import { EmailValidation } from '../email/email-validation';

import { ValidationBuilder as sut } from './validation-builder';

describe('ValidationBuilder', () => {
  test('Should return RequiredFieldValidation', () => {
    const validations = sut.field('any_field').required().build();

    expect(validations).toEqual([new RequiredFieldValidation('any_field')]);
  });

  test('Should return EmailValidation', () => {
    const validations = sut.field('any_field').email().build();

    expect(validations).toEqual([new EmailValidation('any_field')]);
  });
});