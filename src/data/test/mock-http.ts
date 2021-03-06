import faker from 'faker';

import {
  HttpClient,
  HttpMethod,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@/data/protocols/http';

export const mockHttpRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  method: faker.random.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
  body: faker.random.objectElement<{}>(),
  headers: faker.random.objectElement<{}>(),
});

export class HttpClientSpy<T = any> implements HttpClient<T> {
  url?: string;
  method?: HttpMethod;
  body?: any;
  headers?: any;
  response: HttpResponse<T> = {
    statusCode: HttpStatusCode.ok,
  };

  async request(data: HttpRequest): Promise<HttpResponse<T>> {
    this.url = data.url;
    this.method = data.method;
    this.body = data.body;
    this.headers = data.headers;

    return this.response;
  }
}
