import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';

import { ApiContext } from '@/presentation/contexts';
import { LoadSurveyResultSpy, mockAccountModel, mockSurveyResultModel } from '@/domain/test';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { AccountModel } from '@/domain/models';

import { Router } from 'react-router-dom';
import SurveyResult from './survey-result';

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy;
  history: MemoryHistory;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const makeSut = (loadSurveyResultSpy = new LoadSurveyResultSpy()): SutTypes => {
  const history = createMemoryHistory();
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: mockAccountModel,
      }}
    >
      <Router history={history}>
        <SurveyResult loadSurveyResult={loadSurveyResultSpy} />
      </Router>
    </ApiContext.Provider>,
  );

  return { loadSurveyResultSpy, history, setCurrentAccountMock };
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

  test('Should logout on accessDeniedError', async () => {
    const loadSurveyListSpy = new LoadSurveyResultSpy();
    jest.spyOn(loadSurveyListSpy, 'load').mockRejectedValueOnce(new AccessDeniedError());
    const { history, setCurrentAccountMock } = makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByTestId('survey-result'));
    expect(setCurrentAccountMock).toBeCalledWith(null);
    expect(history.location.pathname).toBe('/login');
  });

  test('Should call loadSurveyList on reload', async () => {
    const loadSurveyListSpy = new LoadSurveyResultSpy();
    jest.spyOn(loadSurveyListSpy, 'load').mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByTestId('survey-result'));
    fireEvent.click(screen.getByTestId('reload'));
    expect(loadSurveyListSpy.callsCount).toBe(1);
    await waitFor(() => screen.getByTestId('survey-result'));
  });
});
