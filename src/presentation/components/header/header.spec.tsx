import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';

import { ApiContext } from '@/presentation/contexts';
import { AccountModel } from '@/domain/models';

import Header from './header';

type SutTypes = {
  history: MemoryHistory;
  setCurrentAccountMock(account: AccountModel): void;
};

const makeSut = (): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: null,
      }}
    >
      <Router history={history}>
        <Header />
      </Router>
    </ApiContext.Provider>,
  );

  return { history, setCurrentAccountMock };
};

describe('HeaderComponent', () => {
  test('Should call setCurrentAccount with null', () => {
    const { history, setCurrentAccountMock } = makeSut();

    fireEvent.click(screen.getByTestId('logout'));
    expect(setCurrentAccountMock).toBeCalledWith(null);
    expect(history.location.pathname).toBe('/login');
  });
});
