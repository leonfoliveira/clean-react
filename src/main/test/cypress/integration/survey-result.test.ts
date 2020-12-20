import * as Helpers from '../utils/helpers';
import { Interceptor } from '../utils/interceptor';

const path = /api\/surveys/;
const mockLoadSuccess = () => Interceptor.mockOk('GET', path, { fixture: 'load-survey-result' });

describe('SurveyResult', () => {
  describe('load', () => {
    const mockUnexpectedError = () => Interceptor.mockCustomErrors('GET', path, [404, 500]);
    const mockAccessDeniedError = () => Interceptor.mockForbidden('GET', path);

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
          req.reply({ statusCode: 200, fixture: 'load-survey-result' });
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
      mockLoadSuccess();
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
      mockLoadSuccess();
      cy.visit('/');
      cy.visit('/surveys/any_id');
      cy.getByTestId('back-button').click();
      Helpers.testUrl('/');
    });
  });

  describe('save', () => {
    const mockUnexpectedError = () => Interceptor.mockCustomErrors('PUT', path, [404, 500]);
    const mockAccessDeniedError = () => Interceptor.mockForbidden('PUT', path);
    const mockSaveSuccess = () =>
      Interceptor.mockOk('PUT', path, { fixture: 'save-survey-result' });

    beforeEach(() => {
      cy.fixture('account').then((account) => {
        Helpers.setLocalStorageItem('account', account);
      });
      mockLoadSuccess();
      cy.visit('/surveys/any_id');
    });

    it('Should present error on UnexpectedError', () => {
      mockUnexpectedError();
      cy.get('li:nth-child(2)').click();
      cy.getByTestId('error').should('contain.text', 'Something wrong happened. Try again.');
    });

    it('Should logout on AccessDeniedError', () => {
      mockAccessDeniedError();
      cy.get('li:nth-child(2)').click();
      Helpers.testUrl('/login');
    });

    it('Should present survey result', () => {
      mockSaveSuccess();
      cy.get('li:nth-child(2)').click();
      cy.getByTestId('question').should('have.text', 'Other Question');
      cy.getByTestId('day').should('have.text', '23');
      cy.getByTestId('month').should('have.text', 'mar');
      cy.getByTestId('year').should('have.text', '2020');
      cy.get('li:nth-child(1)').then((li) => {
        assert.isNotEmpty(li.attr('class'));
        assert.equal(li.find('[data-testid="answer"]').text(), 'other_answer');
        assert.equal(li.find('[data-testid="image"]').attr('src'), 'other_image');
        assert.equal(li.find('[data-testid="percent"]').text(), '50%');
      });
      cy.get('li:nth-child(2)').then((li) => {
        assert.equal(li.find('[data-testid="answer"]').text(), 'other_answer_2');
        assert.notExists(li.find('[data-testid="image"]'));
        assert.equal(li.find('[data-testid="percent"]').text(), '50%');
      });
    });
  });
});
