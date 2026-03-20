const suffix = Date.now();

const newUser = {
  firstName: 'John',
  lastName: 'Doe',
  login: `login_${suffix}`,
  password: `pwd123!_${suffix}`,
};

describe('E2E User tests', () => {
  describe('CREATE', () => {
    it('creates a user successfully', () => {
      cy.visit('/register');
      cy.get('input[formControlName="firstName"]').type(newUser.firstName);
      cy.get('input[formControlName="lastName"]').type(newUser.lastName);
      cy.get('input[formControlName="login"]').type(newUser.login);
      cy.get('input[formControlName="password"]').type(newUser.password);
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/login');
    });

    it('fails to create a user because it already exists', () => {
      cy.intercept('POST', '/api/register').as('registerRequest');
      cy.visit('/register');
      cy.get('input[formControlName="firstName"]').type(newUser.firstName);
      cy.get('input[formControlName="lastName"]').type(newUser.lastName);
      cy.get('input[formControlName="login"]').type(newUser.login);
      cy.get('input[formControlName="password"]').type(newUser.password);
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/register');
      cy.wait('@registerRequest')
        .its('response.statusCode')
        .should('not.eq', 201);
    });
  });
});
