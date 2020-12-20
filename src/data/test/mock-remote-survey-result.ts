import faker from 'faker';

import { RemoteLoadSurveyResult } from '../usecases';

export const mockRemoteSurveyResultModel = (): RemoteLoadSurveyResult.Model => ({
  question: faker.random.words(),
  date: faker.date.recent().toISOString(),
  answers: [
    {
      image: faker.random.words(),
      answer: faker.random.words(),
      count: faker.random.number(),
      percent: faker.random.number(100),
      isCurrentAccountAnswer: faker.random.boolean(),
    },
    {
      answer: faker.random.words(),
      count: faker.random.number(),
      percent: faker.random.number(100),
      isCurrentAccountAnswer: faker.random.boolean(),
    },
  ],
});
