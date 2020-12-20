import * as Helpers from '../utils/helpers';
import { Interceptor } from '../utils/interceptor';

const path = /surveys\/(.+)\/results/;
const mockUnexpectedError = () => Interceptor.mockCustomErrors('GET', path, [404, 500]);
const mockAccessDeniedError = () => Interceptor.mockForbidden('GET', path);
const mockSuccess = () => Interceptor.mockOk('GET', path, { fixture: 'survey-result' });

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

  it('Should logout on AccessDeniedError', () => {
    mockAccessDeniedError();
    cy.visit('/surveys/any_id');
    Helpers.testUrl('/login');
  });

  it('Should present survey result', () => {
    mockSuccess();
    cy.visit('/surveys/any_id');
    cy.getByTestId('question').should('have.text', 'Question');
    cy.getByTestId('day').should('have.text', '03');
    cy.getByTestId('month').should('have.text', 'fev');
    cy.getByTestId('year').should('have.text', '2018');
    cy.get('li:nth-child(1)').then((li) => {
      assert.isNotEmpty(li.attr('class'));
      assert.equal(li.find('[data-testid="answer"]').text(), 'any_answer');
      assert.equal(li.find('[data-testid="image"]').attr('src'), 'any_image');
      assert.equal(li.find('[data-testid="percent"]').text(), '70%');
    });
    cy.get('li:nth-child(2)').then((li) => {
      assert.equal(li.find('[data-testid="answer"]').text(), 'any_answer_2');
      assert.notExists(li.find('[data-testid="image"]'));
      assert.equal(li.find('[data-testid="percent"]').text(), '30%');
    });
  });

  it('Should back on back button click', () => {
    cy.intercept('GET', /surveys$/, (req) => {
      req.destroy();
    });
    mockSuccess();
    cy.visit('/');
    cy.visit('/surveys/any_id');
    cy.getByTestId('back-button').click();
    Helpers.testUrl('/');
  });
});
