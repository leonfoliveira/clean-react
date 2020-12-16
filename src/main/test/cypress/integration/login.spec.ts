import faker from 'faker';

const { baseUrl } = Cypress.config();

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login');
  });

  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly');
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('contain.text', '🔴');
    cy.getByTestId('password').should('have.attr', 'readOnly');
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Campo Obrigatório')
      .should('contain.text', '🔴');
    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word());
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴');
    cy.getByTestId('password').focus().type(faker.internet.password(3));
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴');
    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Tudo Certo!')
      .should('contain.text', '🟢');
    cy.getByTestId('password').focus().type(faker.internet.password(5));
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Tudo Certo!')
      .should('contain.text', '🟢');
    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error if invalid credentials are provided', () => {
    cy.intercept(/login/, { statusCode: 401 });
    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));
    cy.getByTestId('submit').click();
    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should('contain.text', 'Invalid Credentials');
    cy.url().should('equal', `${baseUrl}/login`);
  });

  it('Should present UnexpectedError on any other error', () => {
    cy.intercept(/login/, { statusCode: faker.random.arrayElement([400, 404, 500]) });
    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));
    cy.getByTestId('submit').click();
    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should('contain.text', 'Something wrong happened. Try again.');
    cy.url().should('equal', `${baseUrl}/login`);
  });

  it('Should present UnexpectedError if invalid data is returned', () => {
    cy.intercept(/login/, {
      body: { invalidProperty: faker.random.uuid() },
    });
    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));
    cy.getByTestId('submit').click();
    cy.getByTestId('spinner').should('not.exist');
    cy.getByTestId('main-error').should('contain.text', 'Something wrong happened. Try again.');
    cy.url().should('equal', `${baseUrl}/login`);
  });

  it('Should present save accessToken if valid credentials are provided', () => {
    const accessToken = faker.random.uuid();
    cy.intercept(/login/, {
      body: { accessToken },
    });
    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));
    cy.getByTestId('submit').click();
    cy.getByTestId('main-error').should('not.exist');
    cy.getByTestId('spinner').should('not.exist');
    cy.url().should('equal', `${baseUrl}/`);
    cy.window().then((window) =>
      assert.deepEqual(window.localStorage.getItem('accessToken'), accessToken),
    );
  });

  it('Should prevent multiple submits', () => {
    let count = 0;
    cy.intercept(/login/, (req) => {
      count += 1;
      req.reply({});
    });
    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.internet.password(5));
    cy.getByTestId('submit')
      .dblclick()
      .then(() => assert.deepEqual(count, 1));
  });

  it('Should not submit if form is invalid', () => {
    let count = 0;
    cy.intercept(/login/, (req) => {
      count += 1;
      req.reply({});
    });
    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .type('{enter}')
      .then(() => assert.deepEqual(count, 0));
  });
});
