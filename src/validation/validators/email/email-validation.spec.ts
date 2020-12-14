import faker from 'faker';

import { InvalidFieldError } from '@/validation/errors';

import { EmailValidation } from './email-validation';

describe('EmailValidation', () => {
  test('Should return error if error is invalid', () => {
    const sut = new EmailValidation('email');

    const error = sut.validate(faker.random.word());

    expect(error).toEqual(new InvalidFieldError());
  });

  test('Should return error if error is valid', () => {
    const sut = new EmailValidation('email');

    const error = sut.validate(faker.internet.email());

    expect(error).toBeFalsy();
  });
});
