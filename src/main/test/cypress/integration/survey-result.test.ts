import * as Helpers from '../utils/helpers';
import { Interceptor } from '../utils/interceptor';

const path = /surveys\/(.+)\/results/;
const mockUnexpectedError = () => Interceptor.mockCustomErrors('GET', path, [404, 500]);
// const mockAccessDeniedError = () => Interceptor.mockForbidden('GET', path);
// const mockSuccess = () => Interceptor.mockOk('GET', path, { fixture: 'survey-list' });

describe('SurveyResult', () => {
  beforeEach(() => {
    cy.fixture('account').then((account) => {
      Helpers.setLocalStorageItem('account', account);
    });
  });

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError();
    cy.visit('/surveys/any_id');
    cy.getByTestId('error').should('contain.text', 'Something wrong happened. Try again.');
  });
});
