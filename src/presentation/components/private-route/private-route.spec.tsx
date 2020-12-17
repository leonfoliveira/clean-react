import React from 'react';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history';

import PrivateRoute from './private-route';

describe('PrivateRoute', () => {
  it('Should redirect to /login if token is empty', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });

    render(
      <Router history={history}>
        <PrivateRoute />
      </Router>,
    );

    expect(history.location.pathname).toBe('/login');
  });
});
