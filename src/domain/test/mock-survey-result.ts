import faker from 'faker';

import { LoadSurveyResult, SaveSurveyResult } from '../usecases';

export const mockSaveSurveyResultParams = (): SaveSurveyResult.Params => ({
  answer: faker.random.words(10),
});

export const mockSurveyResultModel = (): LoadSurveyResult.Model => ({
  question: faker.random.words(10),
  date: faker.date.recent(),
  answers: [
    {
      image: faker.internet.url(),
      answer: faker.random.word(),
      count: faker.random.number(),
      percent: faker.random.number(100),
      isCurrentAccountAnswer: true,
    },
    {
      answer: faker.random.word(),
      count: faker.random.number(),
      percent: faker.random.number(100),
      isCurrentAccountAnswer: false,
    },
  ],
});

export class LoadSurveyResultSpy implements LoadSurveyResult {
  callsCount = 0;
  surveyResult = mockSurveyResultModel();

  async load(): Promise<LoadSurveyResult.Model> {
    this.callsCount += 1;
    return this.surveyResult;
  }
}

export class SaveSurveyResultSpy implements SaveSurveyResult {
  params: SaveSurveyResult.Params;
  callsCount = 0;
  surveyResult = mockSurveyResultModel();

  async save(params: SaveSurveyResult.Params): Promise<LoadSurveyResult.Model> {
    this.params = params;
    this.callsCount += 1;
    return this.surveyResult;
  }
}
