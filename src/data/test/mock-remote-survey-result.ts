import faker from 'faker';

import { RemoteLoadSurveyResult } from '../usecases';

export const mockRemoteSurveyResultModel = (): RemoteLoadSurveyResult.Model => ({
  question: faker.random.words(),
  answers: [
    {
      image: faker.random.words(),
      answer: faker.random.words(),
      count: faker.random.number(),
      percent: faker.random.number(100),
    },
    {
      answer: faker.random.words(),
      count: faker.random.number(),
      percent: faker.random.number(100),
    },
  ],
  date: faker.date.recent().toISOString(),
  didAnswer: faker.random.boolean(),
});
