import faker from 'faker';

import { HttpClientSpy } from '@/data/test';
import { Registration } from '@/domain/usecases/registration';
import { mockRegistrationModel, mockRegistrationParams } from '@/domain/test';
import { HttpStatusCode } from '@/data/protocols/http';
import { EmailInUseError, UnexpectedError } from '@/domain/errors';

import { RemoteRegistration } from './remote-registration';

type SutTypes = {
  sut: RemoteRegistration;
  httpClientSpy: HttpClientSpy<Registration.Model>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<Registration.Model>();
  const sut = new RemoteRegistration(url, httpClientSpy);

  return { sut, httpClientSpy };
};

describe('Registration', () => {
  test('Should call HttpPostClient with correct URL and Method', () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

    sut.register(mockRegistrationParams());

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('POST');
  });

  test('Should call HttpPostClient with correct body', () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    const body = mockRegistrationParams();

    sut.register(body);

    expect(httpClientSpy.body).toEqual(body);
  });

  test('Should return an Registration.Model if HttpPostClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    const httpResponse = mockRegistrationModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResponse,
    };

    const account = await sut.register(mockRegistrationParams());

    expect(account).toEqual(httpResponse);
  });

  test('Should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };

    const promise = sut.register(mockRegistrationParams());

    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw InvalidCredentials if HttpPostClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.register(mockRegistrationParams());

    expect(promise).rejects.toThrow(new EmailInUseError());
  });

  test('Should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.register(mockRegistrationParams());

    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.register(mockRegistrationParams());

    expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
