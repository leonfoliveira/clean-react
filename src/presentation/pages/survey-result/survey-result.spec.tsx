import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { ApiContext } from '@/presentation/contexts';
import { LoadSurveyResultSpy, mockAccountModel, mockSurveyResultModel } from '@/domain/test';

import { UnexpectedError } from '@/domain/errors';
import SurveyResult from './survey-result';

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy;
};

const makeSut = (loadSurveyResultSpy = new LoadSurveyResultSpy()): SutTypes => {
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: jest.fn(),
        getCurrentAccount: mockAccountModel,
      }}
    >
      <SurveyResult loadSurveyResult={loadSurveyResultSpy} />
    </ApiContext.Provider>,
  );

  return { loadSurveyResultSpy };
};

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    makeSut();
    const surveyResult = screen.getByTestId('survey-result');

    expect(surveyResult.childElementCount).toBe(0);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    await waitFor(() => surveyResult);
  });

  test('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut();

    await waitFor(() => screen.getByTestId('survey-result'));
    expect(loadSurveyResultSpy.callsCount).toBe(1);
  });

  test('Should present SurveyResult data on success', async () => {
    const loadSurveyResultSpy = new LoadSurveyResultSpy();
    const surveyResult = Object.assign(mockSurveyResultModel(), {
      date: new Date('2020-01-10T00:00:00'),
    });
    loadSurveyResultSpy.surveyResult = surveyResult;
    makeSut(loadSurveyResultSpy);

    await waitFor(() => screen.getByTestId('survey-result'));
    expect(screen.getByTestId('day')).toHaveTextContent('10');
    expect(screen.getByTestId('month')).toHaveTextContent('jan');
    expect(screen.getByTestId('year')).toHaveTextContent('2020');
    expect(screen.getByTestId('question')).toHaveTextContent(surveyResult.question);
    expect(screen.getByTestId('answers').childElementCount).toBe(2);
    const answersWrap = screen.queryAllByTestId('answer-wrap');
    const images = screen.queryAllByTestId('image');
    const answers = screen.queryAllByTestId('answer');
    const percents = screen.queryAllByTestId('percent');
    surveyResult.answers.forEach((answer, index) => {
      if (answer.isCurrentAccountAnswer) {
        expect(answersWrap[index]).toHaveClass('active');
      } else {
        expect(answersWrap[index]).not.toHaveClass('active');
      }
      if (answer.image) {
        expect(images[index]).toHaveAttribute('src', answer.image);
        expect(images[index]).toHaveAttribute('alt', answer.answer);
      } else {
        expect(images[index]).toBeFalsy();
      }
      expect(answers[index]).toHaveTextContent(answer.answer);
      expect(percents[index]).toHaveTextContent(`${answer.percent}%`);
    });
  });

  test('Should render error on unexpectedError', async () => {
    const loadSurveyListSpy = new LoadSurveyResultSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadSurveyListSpy, 'load').mockRejectedValueOnce(error);
    makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByTestId('survey-result'));
    expect(screen.queryByTestId('question')).not.toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent(error.message);
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
  });
});
