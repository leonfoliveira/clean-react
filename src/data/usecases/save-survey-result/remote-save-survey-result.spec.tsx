import faker from 'faker';

import { HttpClientSpy, mockRemoteSurveyResultModel } from '@/data/test';
import { HttpStatusCode } from '@/data/protocols/http';

import { mockSaveSurveyResultParams } from '@/domain/test';
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
});
