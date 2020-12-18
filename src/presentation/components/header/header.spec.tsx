import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { fireEvent, render, screen } from '@testing-library/react';

import { ApiContext } from '@/presentation/contexts';

import Header from './header';

describe('HeaderComponent', () => {
  test('Should call setCurrentAccount with null', () => {
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

    fireEvent.click(screen.getByTestId('logout'));
    expect(setCurrentAccountMock).toBeCalledWith(null);
    expect(history.location.pathname).toBe('/login');
  });
});
