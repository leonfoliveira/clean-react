import { createMemoryHistory, MemoryHistory } from 'history';

import { mockAccountModel } from '@/domain/test';
import { renderWithHistory } from '@/presentation/test';

import PrivateRoute from './private-route';

type SutTypes = {
  history: MemoryHistory;
};

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  renderWithHistory({
    history,
    Page: PrivateRoute,
    account,
  });

  return { history };
};

describe('PrivateRoute', () => {
  it('Should redirect to /login if token is empty', () => {
    const { history } = makeSut(null);

    expect(history.location.pathname).toBe('/login');
  });

  it('Should render current component if token is not empty', () => {
    const { history } = makeSut();

    expect(history.location.pathname).toBe('/');
  });
});
