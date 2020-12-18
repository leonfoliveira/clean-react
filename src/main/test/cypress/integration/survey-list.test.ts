import * as Helpers from '../utils/helpers';
import { Interceptor } from '../utils/interceptor';

const path = /surveys/;
const mockUnexpectedError = () => Interceptor.mockCustomErrors('GET', path, [404, 500]);
const mockAccessDeniedError = () => Interceptor.mockForbidden('GET', path);

describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then((account) => {
      Helpers.setLocalStorageItem('account', account);
    });
  });

  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError();
    cy.visit('');
    cy.getByTestId('error').should('contain.text', 'Something wrong happened. Try again.');
  });

  it('Should logout on AccessDeniedError', () => {
    mockAccessDeniedError();
    cy.visit('');
    Helpers.testUrl('/login');
  });

  it('Should present correct username', () => {
    mockUnexpectedError();
    cy.visit('');
    const { name } = Helpers.getLocalStorageItem('account');
    cy.getByTestId('username').should('contain.text', name);
  });

  it('Should logout on logout link click', () => {
    mockUnexpectedError();
    cy.visit('');
    cy.getByTestId('logout').click();
    Helpers.testUrl('/login');
  });
});
