import { LoadSurveyResult } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { RemoteLoadSurveyResult } from '@/data/usecases';
import { makeAuthorizeHttpGetClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadSurveyResult = (id: string): LoadSurveyResult =>
  new RemoteLoadSurveyResult(
    makeApiUrl(`/surveys/${id}/results`),
    makeAuthorizeHttpGetClientDecorator(),
  );
