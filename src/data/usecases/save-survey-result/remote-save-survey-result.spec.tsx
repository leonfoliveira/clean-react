import faker from 'faker';

import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test';
import { HttpStatusCode } from '@/data/protocols/http';

import { mockSaveSurveyResultParams } from '@/domain/test';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { RemoteSaveSurveyResult } from './remote-save-survey-result';

type SutTypes = {
  sut: RemoteSaveSurveyResult;
  httpClientSpy: HttpClientSpy<RemoteSaveSurveyResult.Model>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<RemoteSaveSurveyResult.Model>();
  const sut = new RemoteSaveSurveyResult(url, httpClientSpy);

  return {
    sut,
    httpClientSpy,
  };
};

describe('RemoteSaveSurveyResult', () => {
  test('Should call HttpGetClient with correct values', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel(),
    };
    const saveSurveyResultParams = mockSaveSurveyResultParams();

    await sut.save(saveSurveyResultParams);

    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('PUT');
    expect(httpClientSpy.body).toEqual(saveSurveyResultParams);
  });

  test('Should throw AccessDeniedError if HttpGetClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('Should throw UnexpectedError if HttpGetClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };

    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexpectedError if HttpGetClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };

    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should return a LoadSurveyResult.Model if HttpGetClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut(faker.internet.url());
    const httpResult = mockRemoteSurveyResultModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };

    const httpResponse = await sut.save(mockSaveSurveyResultParams());

    expect(httpResponse).toEqual({
      ...httpResult,
      date: new Date(httpResult.date),
    });
  });
});
