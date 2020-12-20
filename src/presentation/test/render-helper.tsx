import React from 'react';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { MemoryHistory } from 'history';
import { MutableSnapshot, RecoilRoot, RecoilState } from 'recoil';

import { mockAccountModel } from '@/domain/test';
import { currentAccountState } from '@/presentation/components';
import { AccountModel } from '@/domain/models';

type Params = {
  Page: React.FC;
  history: MemoryHistory;
  account?: AccountModel;
  states?: {
    atom: RecoilState<any>;
    value: any;
  }[];
};

type Result = {
  setCurrentAccountMock: (account: AccountModel) => void;
  getCurrentAccountMock: () => AccountModel;
};

export const renderWithHistory = ({
  Page,
  history,
  account = mockAccountModel(),
  states = [],
}: Params): Result => {
  const setCurrentAccountMock = jest.fn();
  const getCurrentAccountMock = () => account;
  const mockedState = {
    setCurrentAccount: setCurrentAccountMock,
    getCurrentAccount: getCurrentAccountMock,
  };
  const initializeState = ({ set }: MutableSnapshot): void => {
    [...states, { atom: currentAccountState, value: mockedState }].forEach((state) =>
      set(state.atom, state.value),
    );
  };

  render(
    <RecoilRoot initializeState={initializeState}>
      <Router history={history}>
        <Page />
      </Router>
    </RecoilRoot>,
  );

  return { setCurrentAccountMock, getCurrentAccountMock };
};
