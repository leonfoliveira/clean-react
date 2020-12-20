import React from 'react';
import { useRecoilValue } from 'recoil';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { currentAccountState } from '@/presentation/components';

const PrivateRoute: React.FC<RouteProps> = (props) => {
  const { getCurrentAccount } = useRecoilValue(currentAccountState);
  return (
    <Route
      {...props}
      component={
        getCurrentAccount()?.accessToken ? props.component : () => <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
