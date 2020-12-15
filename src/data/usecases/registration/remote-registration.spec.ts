import faker from 'faker';

import { HttpPostClientSpy } from '@/data/mocks';
import { AccountModel } from '@/domain/models';
import { RegistrationParams } from '@/domain/usecases/registration';
import { mockRegistration } from '@/domain/mocks';

import { RemoteRegistration } from './remote-registration';

type SutTypes = {
  sut: RemoteRegistration;
  httpPostClientSpy: HttpPostClientSpy<RegistrationParams, AccountModel>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<RegistrationParams, AccountModel>();
  const sut = new RemoteRegistration(url, httpPostClientSpy);

  return { sut, httpPostClientSpy };
};

describe('Registration', () => {
  test('Should call HttpPostClient with correct URL', () => {
    const url = faker.internet.url();
    const { sut, httpPostClientSpy } = makeSut(url);

    sut.register(mockRegistration());

    expect(httpPostClientSpy.url).toBe(url);
  });
});
