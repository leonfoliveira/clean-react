import { SaveSurveyResult } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { RemoteSaveSurveyResult } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteSaveSurveyResult = (id: string): SaveSurveyResult =>
  new RemoteSaveSurveyResult(
    makeApiUrl(`/surveys/${id}/results`),
    makeAuthorizeHttpClientDecorator(),
  );