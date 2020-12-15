import { Registration } from '@/domain/usecases';
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory';
import { makeApiUrl } from '@/main/factories/http/api-url-factory';
import { RemoteRegistration } from '@/data/usecases/registration/remote-registration';

export const makeRemoteRegistration = (): Registration =>
  new RemoteRegistration(makeApiUrl('/signup'), makeAxiosHttpClient());
