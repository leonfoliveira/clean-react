import React from 'react';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { MemoryHistory } from 'history';
import { RecoilRoot } from 'recoil';

import { mockAccountModel } from '@/domain/test';
import { currentAccountState } from '@/presentation/components';
import { AccountModel } from '@/domain/models';

type Params = {
  Page: React.FC;
  history: MemoryHistory;
  account?: AccountModel;
};

type Result = {
  setCurrentAccountMock: (account: AccountModel) => void;
  getCurrentAccountMock: () => AccountModel;
};

export const renderWithHistory = ({
  Page,
  history,
  account = mockAccountModel(),
}: Params): Result => {
  const setCurrentAccountMock = jest.fn();
  const getCurrentAccountMock = () => account;
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(currentAccountState, {
          setCurrentAccount: setCurrentAccountMock,
          getCurrentAccount: getCurrentAccountMock,
        });
      }}
    >
      <Router history={history}>
        <Page />
      </Router>
    </RecoilRoot>,
  );

  return { setCurrentAccountMock, getCurrentAccountMock };
};
