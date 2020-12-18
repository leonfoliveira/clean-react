import { AuthorizeHttpGetClientDecorator } from '@/main/decorators/authorize-http-get-client';
import { makeLocalStorageAdapter } from '@/main/factories/cache/local-storage-adapter-factory';
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory';
import { HttpGetClient } from '@/data/protocols/http';

export const makeAuthorizeHttpGetClientDecorator = (): HttpGetClient =>
  new AuthorizeHttpGetClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClient());
