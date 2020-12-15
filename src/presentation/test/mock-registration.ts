import { Registration, RegistrationParams } from '@/domain/usecases';
import { AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';

export class RegistrationSpy implements Registration {
  account = mockAccountModel();
  params: RegistrationParams;
  callsCount = 0;

  async register(params: RegistrationParams): Promise<AccountModel> {
    this.params = params;
    this.callsCount += 1;

    return Promise.resolve(this.account);
  }
}
