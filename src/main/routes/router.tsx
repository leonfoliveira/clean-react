import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import {
  setCurrentAccountAdapter,
  getCurrentAccountAdapter,
} from '@/main/adapters/current-account-adapter';
import { makeLogin, makeSignup, makeSurveyList, makeSurveyResult } from '@/main/factories/pages';
import { ApiContext } from '@/presentation/contexts';
import { PrivateRoute } from '@/presentation/components';

const Router: React.FC = () => (
  <RecoilRoot>
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter,
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
    </ApiContext.Provider>
  </RecoilRoot>
);

export default Router;
