import faker from 'faker';

import {
  HttpGetClient,
  HttpGetParams,
  HttpPostClient,
  HttpPostParams,
  HttpResponse,
  HttpStatusCode,
} from '@/data/protocols/http';

export const mockPostRequest = () => ({
  url: faker.internet.url(),
  body: faker.random.objectElement(),
});

export const mockGetRequest = () => ({
  url: faker.internet.url(),
});

export class HttpPostClientSpy<ResponseType, BodyType = any>
  implements HttpPostClient<ResponseType, BodyType> {
  url?: string;
  body?: BodyType;
  response: HttpResponse<ResponseType> = {
    statusCode: HttpStatusCode.ok,
  };

  async post(params: HttpPostParams<BodyType>): Promise<HttpResponse<ResponseType>> {
    this.url = params.url;
    this.body = params.body;

    return Promise.resolve(this.response);
  }
}

export class HttpGetClientSpy<ResponseType> implements HttpGetClient<ResponseType> {
  url: string;
  response: HttpResponse<ResponseType> = {
    statusCode: HttpStatusCode.ok,
  };

  async get(params: HttpGetParams): Promise<HttpResponse<ResponseType>> {
    this.url = params.url;

    return Promise.resolve(this.response);
  }
}
