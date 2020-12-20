import { LoadSurveyList } from '@/domain/usecases';
import { makeApiUrl } from '@/main/factories/http';
import { RemoteLoadSurveyList } from '@/data/usecases';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteLoadSurveyList = (): LoadSurveyList =>
  new RemoteLoadSurveyList(makeApiUrl('/surveys'), makeAuthorizeHttpClientDecorator());
