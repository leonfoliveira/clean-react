import { HttpPostClientSpy } from '@/data/mocks';
import { AccountModel } from '@/domain/models';
import { RegistrationParams } from '@/domain/usecases/registration';

import { RemoteRegistration } from './remote-registration';

describe('Registration', () => {
  test('Should call HttpPostClient with correct URL', () => {
    const httpPostClientSpy = new HttpPostClientSpy<RegistrationParams, AccountModel>();
    const sut = new RemoteRegistration('any_url', httpPostClientSpy);

    sut.register({
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    });

    expect(httpPostClientSpy.url).toBe('any_url');
  });
});
