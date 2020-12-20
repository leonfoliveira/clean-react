import faker from 'faker';

import { HttpClientSpy, mockHttpRequest } from '@/data/test';
import { GetStorageSpy } from '@/data/test/mock-cache';
import { HttpRequest } from '@/data/protocols/http';
import { mockAccountModel } from '@/domain/test';

import { AuthorizeHttpClientDecorator } from './authorize-http-get-client-decorator';

type SutTypes = {
  sut: AuthorizeHttpClientDecorator;
  getStorageSpy: GetStorageSpy;
  httpGetClientSpy: HttpClientSpy;
};

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy();
  const httpGetClientSpy = new HttpClientSpy();
  const sut = new AuthorizeHttpClientDecorator(getStorageSpy, httpGetClientSpy);

  return { sut, getStorageSpy, httpGetClientSpy };
};

describe('AuthorizeHttpGetClientDecorator', () => {
  test('Should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();

    await sut.request(mockHttpRequest());

    expect(getStorageSpy.key).toBe('account');
  });

  test('Should not add headers if getStorage is invalid', async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const httpRequest = mockHttpRequest();

    await sut.request(httpRequest);

    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.method).toBe(httpRequest.method);
    expect(httpGetClientSpy.headers).toEqual(httpRequest.headers);
  });

  test('Should add headers to HttpGetClient', async () => {
    const { sut, getStorageSpy, httpGetClientSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.random.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
    };

    await sut.request(httpRequest);

    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.method).toBe(httpRequest.method);
    expect(httpGetClientSpy.headers).toEqual({
      'x-access-token': getStorageSpy.value.accessToken,
    });
  });

  test('Should merge headers to HttpGetClient', async () => {
    const { sut, getStorageSpy, httpGetClientSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const field = faker.random.words();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: faker.random.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
      headers: {
        field,
      },
    };

    await sut.request(httpRequest);

    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.headers).toEqual({
      field,
      'x-access-token': getStorageSpy.value.accessToken,
    });
  });

  test('Should return the same as HttpGetClient', async () => {
    const { sut, httpGetClientSpy } = makeSut();

    const httpResponse = await sut.request(mockHttpRequest());

    expect(httpResponse).toEqual(httpGetClientSpy.response);
  });
});
