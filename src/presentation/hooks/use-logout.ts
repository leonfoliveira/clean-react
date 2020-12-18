/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { ApiContext } from '@/presentation/contexts';

type ResultType = () => void;

export const useLogout = (): ResultType => {
  const history = useHistory();
  const { setCurrentAccount } = useContext(ApiContext);

  return (): void => {
    setCurrentAccount(null);
    history.replace('/login');
  };
};
