import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';

import { ApiContext } from '@/presentation/contexts';
import { mockAccountModel } from '@/domain/test';

import PrivateRoute from './private-route';

type SutTypes = {
  history: MemoryHistory;
};

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(
    <Router history={history}>
      <ApiContext.Provider
        value={{ setCurrentAccount: () => {}, getCurrentAccount: () => account }}
      >
        <PrivateRoute />
      </ApiContext.Provider>
    </Router>,
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
