import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { RecoilRoot } from 'recoil';

import { mockAccountModel } from '@/domain/test';

import PrivateRoute from './private-route';
import { currentAccountState } from '../atoms/atoms';

type SutTypes = {
  history: MemoryHistory;
};

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(currentAccountState, {
          setCurrentAccount: () => {},
          getCurrentAccount: () => account,
        });
      }}
    >
      <Router history={history}>
        <PrivateRoute />
      </Router>
    </RecoilRoot>,
  );

  return { history };
};

describe('PrivateRoute', () => {
  it('Should redirect to /login if token is empty', () => {
    const { history } = makeSut(null);

    expect(history.location.pathname).toBe('/login');
  });

  it('Should render current component if token is not empty', () => {
    const { history } = makeSut();

    expect(history.location.pathname).toBe('/');
  });
});
