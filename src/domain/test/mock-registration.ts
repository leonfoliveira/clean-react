import faker from 'faker';

import { mockAccountModel } from '@/domain/test';
import { Registration } from '@/domain/usecases';

export const mockRegistrationParams = (): Registration.Params => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  };
};

export const mockRegistrationModel = (): Registration.Model => mockAccountModel();

export class RegistrationSpy implements Registration {
  account = mockRegistrationModel();
  params: Registration.Params;
  callsCount = 0;

  async register(params: Registration.Params): Promise<Registration.Model> {
    this.params = params;
    this.callsCount += 1;

    return Promise.resolve(this.account);
  }
}
