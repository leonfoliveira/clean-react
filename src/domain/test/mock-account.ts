import faker from 'faker';

import { AuthenticationParams, RegistrationParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';

export const mockAuthentication = (): AuthenticationParams => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const mockRegistration = (): RegistrationParams => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  };
};

export const mockAccountModel = (): AccountModel => ({
  name: faker.name.findName(),
  accessToken: faker.random.uuid(),
});
