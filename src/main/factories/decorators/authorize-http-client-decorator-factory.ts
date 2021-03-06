import { AuthorizeHttpClientDecorator } from '@/main/decorators/authorize-http-get-client';
import { makeLocalStorageAdapter } from '@/main/factories/cache/local-storage-adapter-factory';
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory';
import { HttpClient } from '@/data/protocols/http';

export const makeAuthorizeHttpClientDecorator = (): HttpClient =>
  new AuthorizeHttpClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClient());
