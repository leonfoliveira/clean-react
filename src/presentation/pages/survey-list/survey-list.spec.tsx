import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { LoadSurveyListSpy, mockAccountModel } from '@/domain/test';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { ApiContext } from '@/presentation/contexts';
import { AccountModel } from '@/domain/models';

import SurveyList from './survey-list';

type SutTypes = {
  history: MemoryHistory;
  loadSurveyListSpy: LoadSurveyListSpy;
  setCurrentAccountMock: (account: AccountModel) => void;
};

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutTypes => {
  const history = createMemoryHistory();
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <Router history={history}>
        <SurveyList loadSurveyList={loadSurveyListSpy} />
      </Router>
    </ApiContext.Provider>,
  );

  return { history, loadSurveyListSpy, setCurrentAccountMock };
};

describe('SurveyList Component', () => {
  test('Should present 4 empty items on start', async () => {
    makeSut();
    const surveyList = screen.getByTestId('survey-list');

    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    await waitFor(() => surveyList);
  });

  test('Should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut();

    expect(loadSurveyListSpy.callsCount).toBe(1);
    await waitFor(() => screen.getByRole('heading'));
  });

  test('Should render SurveyItems on success', async () => {
    makeSut();

    const surveyList = screen.getByTestId('survey-list');

    await waitFor(() => surveyList);
    expect(surveyList.querySelectorAll('li.surveyItemWrap')).toHaveLength(3);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  test('Should render error on unexpectedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error);
    makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByRole('heading'));
    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent(error.message);
  });

  test('Should logout on accessDeniedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new AccessDeniedError());
    const { history, setCurrentAccountMock } = makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByRole('heading'));
    expect(setCurrentAccountMock).toBeCalledWith(null);
    expect(history.location.pathname).toBe('/login');
  });

  test('Should call loadSurveyList on reload', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new UnexpectedError());
    makeSut(loadSurveyListSpy);

    await waitFor(() => screen.getByRole('heading'));
    fireEvent.click(screen.getByTestId('reload'));
    expect(loadSurveyListSpy.callsCount).toBe(1);
    await waitFor(() => screen.getByRole('heading'));
  });
});
