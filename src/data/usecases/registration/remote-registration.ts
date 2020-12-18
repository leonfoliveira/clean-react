import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http';
import { EmailInUseError, UnexpectedError } from '@/domain/errors';
import { Registration } from '@/domain/usecases/registration';

export class RemoteRegistration implements Registration {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<RemoteRegistration.Model, Registration.Params>,
  ) {}

  async register(params: Registration.Params): Promise<Registration.Model> {
    const httpResponse = await this.httpPostClient.post({ url: this.url, body: params });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body;
      case HttpStatusCode.forbidden:
        throw new EmailInUseError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteRegistration {
  export type Model = Registration.Model;
}
