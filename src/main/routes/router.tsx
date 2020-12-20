import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import {
  setCurrentAccountAdapter,
  getCurrentAccountAdapter,
} from '@/main/adapters/current-account-adapter';
import { makeLogin, makeSignup, makeSurveyList, makeSurveyResult } from '@/main/factories/pages';
import { PrivateRoute, currentAccountState } from '@/presentation/components';

const Router: React.FC = () => (
  <RecoilRoot
    initializeState={({ set }) => {
      set(currentAccountState, {
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter,
      });
    }}
  >
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={makeLogin} />
        <Route path="/signup" exact component={makeSignup} />
        <PrivateRoute path="/" exact component={makeSurveyList} />
        <PrivateRoute path="/surveys/:id" exact component={makeSurveyResult} />
      </Switch>
    </BrowserRouter>
  </RecoilRoot>
);

export default Router;
