import React from 'react';
import { Router } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';

import { mockSurveyModel } from '@/domain/test';
import { IconName } from '@/presentation/components';

import SurveyItem from './item';

type SutTypes = {
  history: MemoryHistory;
};

const makeSut = (survey = mockSurveyModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(
    <Router history={history}>
      <SurveyItem survey={survey} />
    </Router>,
  );

  return { history };
};

describe('SurveyItem Component', () => {
  it('Should render with correct values', () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: true,
      date: new Date('2020-01-10T00:00:00'),
    });
    makeSut(survey);

    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbUp);
    expect(screen.getByTestId('day')).toHaveTextContent('10');
    expect(screen.getByTestId('month')).toHaveTextContent('jan');
    expect(screen.getByTestId('year')).toHaveTextContent('2020');
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question);
  });

  it('Should render with correct values', () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: false,
      date: new Date('2019-05-03T00:00:00'),
    });
    makeSut(survey);

    expect(screen.getByTestId('icon')).toHaveProperty('src', IconName.thumbDown);
    expect(screen.getByTestId('day')).toHaveTextContent('03');
    expect(screen.getByTestId('month')).toHaveTextContent('mai');
    expect(screen.getByTestId('year')).toHaveTextContent('2019');
    expect(screen.getByTestId('question')).toHaveTextContent(survey.question);
  });

  it('Should go to survey result', () => {
    const survey = mockSurveyModel();
    const { history } = makeSut(survey);

    fireEvent.click(screen.getByTestId('link'));
    expect(history.location.pathname).toBe(`/surveys/${survey.id}`);
  });
});
