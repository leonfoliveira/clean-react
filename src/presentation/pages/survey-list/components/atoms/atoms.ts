import { atom } from 'recoil';

import { LoadSurveyList } from '@/domain/usecases';

export const surveyListState = atom({
  key: 'loginState',
  default: {
    surveys: [] as LoadSurveyList.Model[],
    error: '',
    reload: false,
  },
});
