import faker from 'faker';

import {
  HttpGetClient,
  HttpGetParams,
  HttpPostClient,
  HttpPostParams,
  HttpResponse,
  HttpStatusCode,
} from '@/data/protocols/http';

export const mockPostRequest = (): HttpPostParams => ({
  url: faker.internet.url(),
  body: faker.random.objectElement<{}>(),
});

export const mockGetRequest = (): HttpGetParams => ({
  url: faker.internet.url(),
  headers: faker.random.objectElement<{}>(),
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

    return this.response;
  }
}

export class HttpGetClientSpy<ResponseType, HeadersType = any>
  implements HttpGetClient<ResponseType, HeadersType> {
  url: string;
  headers?: object;
  response: HttpResponse<ResponseType> = {
    statusCode: HttpStatusCode.ok,
  };

  async get(params: HttpGetParams): Promise<HttpResponse<ResponseType>> {
    this.url = params.url;
    this.headers = params.headers;

    return this.response;
  }
}
