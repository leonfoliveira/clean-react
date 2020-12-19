import { HttpGetClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { LoadSurveyResult } from '@/domain/usecases';

export class RemoteLoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<RemoteLoadSurveyResult.Model>,
  ) {}

  async load(): Promise<void> {
    const httpResponse = await this.httpGetClient.get({ url: this.url });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        break;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteLoadSurveyResult {
  export type Model = LoadSurveyResult.Model;
}
