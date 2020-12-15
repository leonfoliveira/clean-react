import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http';
import { UnexpectedError } from '@/domain/errors';
import { AccountModel } from '@/domain/models';
import { Registration, RegistrationParams } from '@/domain/usecases/registration';

export class RemoteRegistration implements Registration {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<RegistrationParams, AccountModel>,
  ) {}

  async register(params: RegistrationParams): Promise<AccountModel> {
    const httpResponse = await this.httpPostClient.post({ url: this.url, body: params });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body;
      default:
        throw new UnexpectedError();
    }
  }
}
