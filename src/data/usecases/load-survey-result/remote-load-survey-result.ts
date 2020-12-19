import { HttpGetClient } from '@/data/protocols/http';
import { LoadSurveyResult } from '@/domain/usecases';

export class RemoteLoadSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient<RemoteLoadSurveyResult.Model>,
  ) {}

  async load(): Promise<void> {
    this.httpGetClient.get({ url: this.url });
  }
}

export namespace RemoteLoadSurveyResult {
  export type Model = LoadSurveyResult.Model;
}
