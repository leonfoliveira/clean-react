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

  it('Should reload on button click', () => {
    let ok = false;
    cy.intercept('GET', path, (req) => {
      if (ok) {
        req.reply({ statusCode: 200, fixture: 'survey-result' });
      } else {
        req.reply({ statusCode: 500 });
      }
      ok = !ok;
    });
    cy.visit('/surveys/any_id');
    cy.getByTestId('error').should('contain.text', 'Something wrong happened. Try again.');
    cy.getByTestId('reload').click();
    cy.getByTestId('question').should('exist');
  });
});
