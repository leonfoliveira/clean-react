import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { setCurrentAccountAdapter } from '@/main/adapters/current-account-adapter';
import { makeLogin } from '@/main/factories/pages/login/login-factory';
import { makeSignup } from '@/main/factories/pages/signup/signup-factory';
import { ApiContext } from '@/presentation/contexts';
import { SurveyList } from '@/presentation/pages';

const Router: React.FC = () => (
  <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountAdapter }}>
    <BrowserRouter>
      <Switch>
        <Route path="/login" exact component={makeLogin} />
        <Route path="/signup" exact component={makeSignup} />
        <Route path="/" exact component={SurveyList} />
      </Switch>
    </BrowserRouter>
  </ApiContext.Provider>
);

export default Router;
