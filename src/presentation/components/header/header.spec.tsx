import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import { AccountModel } from '@/domain/models';
import { mockAccountModel } from '@/domain/test';

import Header from './header';
import { currentAccountState } from '../atoms/atoms';

type SutTypes = {
  history: MemoryHistory;
  setCurrentAccountMock(account: AccountModel): void;
};

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const setCurrentAccountMock = jest.fn();
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(currentAccountState, {
          setCurrentAccount: setCurrentAccountMock,
          getCurrentAccount: () => account,
        });
      }}
    >
      <Router history={history}>
        <Header />
      </Router>
    </RecoilRoot>,
  );

  return { history, setCurrentAccountMock };
};

describe('Header Component', () => {
  test('Should call setCurrentAccount with null', () => {
    const { history, setCurrentAccountMock } = makeSut();

    fireEvent.click(screen.getByTestId('logout'));
    expect(setCurrentAccountMock).toBeCalledWith(null);
    expect(history.location.pathname).toBe('/login');
  });

  test('Should render username correctly', () => {
    const account = mockAccountModel();
    makeSut(account);

    expect(screen.getByTestId('username')).toHaveTextContent(account.name);
  });
});
