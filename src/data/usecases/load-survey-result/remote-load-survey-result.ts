import { HttpGetClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError } from '@/domain/errors';
import { LoadSurveyResult } from '@/domain/usecases';

export class RemoteLoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<RemoteLoadSurveyResult.Model>,
  ) {}

  async load(): Promise<void> {
    const httpResponse = await this.httpGetClient.get({ url: this.url });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
    }
  }
}

export namespace RemoteLoadSurveyResult {
  export type Model = LoadSurveyResult.Model;
}
