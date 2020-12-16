import faker from 'faker';

import { HttpPostClientSpy } from '@/data/test';
import { AccountModel } from '@/domain/models';
import { RegistrationParams } from '@/domain/usecases/registration';
import { mockAccountModel, mockRegistration } from '@/domain/test';
import { HttpStatusCode } from '@/data/protocols/http';
import { EmailInUseError, UnexpectedError } from '@/domain/errors';

import { RemoteRegistration } from './remote-registration';

type SutTypes = {
  sut: RemoteRegistration;
  httpPostClientSpy: HttpPostClientSpy<AccountModel, RegistrationParams>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AccountModel, RegistrationParams>();
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

  test('Should call HttpPostClient with correct body', () => {
    const { sut, httpPostClientSpy } = makeSut(faker.internet.url());
    const body = mockRegistration();

    sut.register(body);

    expect(httpPostClientSpy.body).toEqual(body);
  });

  test('Should return an AccountModel if HttpPostClient returns 200', async () => {
    const { sut, httpPostClientSpy } = makeSut(faker.internet.url());
    const httpResponse = mockAccountModel();
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResponse,
    };

    const account = await sut.register(mockRegistration());

    expect(account).toEqual(httpResponse);
  });

  test('Should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const { sut, httpPostClientSpy } = makeSut(faker.internet.url());
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };

    const promise = sut.register(mockRegistration());

    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw InvalidCredentials if HttpPostClient returns 403', async () => {
    const { sut, httpPostClientSpy } = makeSut(faker.internet.url());
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.register(mockRegistration());

    expect(promise).rejects.toThrow(new EmailInUseError());
  });

  test('Should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { sut, httpPostClientSpy } = makeSut(faker.internet.url());
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.register(mockRegistration());

    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { sut, httpPostClientSpy } = makeSut(faker.internet.url());
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.register(mockRegistration());

    expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
