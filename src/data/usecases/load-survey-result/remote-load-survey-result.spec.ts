import faker from 'faker';

import { HttpGetClientSpy } from '@/data/test';
import { HttpStatusCode } from '@/data/protocols/http';

import { AccessDeniedError } from '@/domain/errors';
import { RemoteLoadSurveyResult } from './remote-load-survey-result';

type SutTypes = {
  sut: RemoteLoadSurveyResult;
  httpGetClientSpy: HttpGetClientSpy<RemoteLoadSurveyResult.Model>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<RemoteLoadSurveyResult.Model>();
  const sut = new RemoteLoadSurveyResult(url, httpGetClientSpy);

  return {
    sut,
    httpGetClientSpy,
  };
};

describe('RemoteSurveyResult', () => {
  test('Should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url();
    const { sut, httpGetClientSpy } = makeSut(url);

    await sut.load();

    expect(httpGetClientSpy.url).toBe(url);
  });

  test('Should throw AccessDeniedError if HttpGetClient returns 403', async () => {
    const { sut, httpGetClientSpy } = makeSut();
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };

    const promise = sut.load();
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });
});
