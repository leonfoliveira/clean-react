import { HttpPostClient } from '@/data/protocols/http';
import { AccountModel } from '@/domain/models';
import { RegistrationParams } from '@/domain/usecases/registration';

export class RemoteRegistration {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<RegistrationParams, AccountModel>,
  ) {}

  async register(params: RegistrationParams): Promise<void> {
    await this.httpPostClient.post({ url: this.url, body: params });
  }
}
