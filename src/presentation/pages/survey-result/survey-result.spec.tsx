import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import { ApiContext } from '@/presentation/contexts';
import { mockAccountModel } from '@/domain/test';

import SurveyResult from './survey-result';

describe('SurveyResult Component', () => {
  test('Should present correct initial state', async () => {
    render(
      <ApiContext.Provider
        value={{
          setCurrentAccount: jest.fn(),
          getCurrentAccount: mockAccountModel,
        }}
      >
        <SurveyResult />
      </ApiContext.Provider>,
    );
    const surveyResult = screen.getByTestId('survey-result');

    expect(surveyResult.childElementCount).toBe(0);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    await waitFor(() => surveyResult);
  });
});
