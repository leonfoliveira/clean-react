import faker from 'faker';

import { HttpClientSpy, mockRemoteSurveyListModel } from '@/data/test';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';

import { RemoteLoadSurveyList } from './remote-load-survey-list';

type SutTypes = {
  sut: RemoteLoadSurveyList;
  httpClientSpy: HttpClientSpy<RemoteLoadSurveyList.Model[]>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteLoadSurveyList.Model[]>();
  const sut = new RemoteLoadSurveyList(url, httpClientSpy);

  return { sut, httpClientSpy };
};

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpGetClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);

    await sut.loadAll();

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('GET');
  });

  test('Should throw AccessDeniedError if HttpGetClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.loadAll();

    expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('Should throw UnexpectedError if HttpGetClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.loadAll();

    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpGetClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.loadAll();

    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should return a list of LoadSurveyList.Model if HttpGetClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    const httpResponse = mockRemoteSurveyListModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResponse,
    };

    const account = await sut.loadAll();

    expect(account).toEqual(
      httpResponse.map((response) => ({
        ...response,
        date: new Date(response.date),
      })),
    );
  });

  test('Should return an empty list if HttpGetClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent,
    };

    const account = await sut.loadAll();

    expect(account).toEqual([]);
  });
});
