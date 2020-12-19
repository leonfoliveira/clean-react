import * as Helpers from '../utils/helpers';
import { Interceptor } from '../utils/interceptor';

const path = /surveys/;
const mockUnexpectedError = () => Interceptor.mockCustomErrors('GET', path, [404, 500]);
const mockAccessDeniedError = () => Interceptor.mockForbidden('GET', path);
const mockSuccess = () => Interceptor.mockOk('GET', path, { fixture: 'survey-list' });

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

  it('Should reload on button click', () => {
    let ok = false;
    cy.intercept('GET', path, (req) => {
      if (ok) {
        req.reply({ statusCode: 200, fixture: 'survey-list' });
      } else {
        req.reply({ statusCode: 500 });
      }
      ok = !ok;
    });
    cy.visit('');
    cy.getByTestId('error').should('contain.text', 'Something wrong happened. Try again.');
    cy.getByTestId('reload').click();
    cy.get('li:not(empty)').should('have.length', 2);
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

  it('Should present survey items', () => {
    mockSuccess();
    cy.visit('');
    cy.get('li:empty').should('have.length', 4);
    cy.get('li:not(:empty)').should('have.length', 2);
    cy.get('li:nth-child(1)').then((li) => {
      assert.equal(li.find('[data-testid="day"]').text(), '03');
      assert.equal(li.find('[data-testid="month"]').text(), 'fev');
      assert.equal(li.find('[data-testid="year"]').text(), '2018');
      assert.equal(li.find('[data-testid="question"]').text(), 'Question 1');
      cy.fixture('icons').then((icon) => {
        assert.equal(li.find('[data-testid="icon"]').attr('src'), icon.thumbUp);
      });
    });
    cy.get('li:nth-child(2)').then((li) => {
      assert.equal(li.find('[data-testid="day"]').text(), '20');
      assert.equal(li.find('[data-testid="month"]').text(), 'out');
      assert.equal(li.find('[data-testid="year"]').text(), '2020');
      assert.equal(li.find('[data-testid="question"]').text(), 'Question 2');
      cy.fixture('icons').then((icon) => {
        assert.equal(li.find('[data-testid="icon"]').attr('src'), icon.thumbDown);
      });
    });
  });
});
