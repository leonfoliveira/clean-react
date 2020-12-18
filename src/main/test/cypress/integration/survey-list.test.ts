import * as Helpers from '../support/helpers';
import { Interceptor } from '../support/interceptor';

describe('SurveyList', () => {
  beforeEach(() => {
    Helpers.setLocalStorageItem('account', Helpers.mockAccount());
  });

  it('Should present error on UnexpectedError', () => {
    Interceptor.mockCustomErrors('GET', /surveys/, [404, 500]);
    cy.visit('');
    cy.getByTestId('error').should('contain.text', 'Something wrong happened. Try again.');
  });

  it('Should logout on AccessDeniedError', () => {
    Interceptor.mockForbidden('GET', /surveys/);
    cy.visit('');
    Helpers.testUrl('/login');
  });
});
