const login = () =>
  cy
    .request('POST', '/api/login', { login: 'aml2', password: '12345' })
    .its('body.token');

describe('Navigation tests', () => {
  let token: string;

  describe('Register page', () => {
    beforeEach(() => {
      cy.visit('/register');
    });

    it('should access register page', () => {
      cy.url().should('include', '/register');
    });

    it('should have a link to login page', () => {
      cy.get('a[href*="login"]').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Login page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('should access login page', () => {
      cy.url().should('include', '/login');
    });

    it('should have a link to register page', () => {
      cy.get('a[href*="register"]').click();
      cy.url().should('include', '/register');
    });

    it('should navigate to student list after login', () => {
      cy.get('input[formControlName="login"]').type('aml2');
      cy.get('input[formControlName="password"]').type('12345');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/students');
    });
  });

  describe('Student detail page', () => {
    describe('with token', () => {
      beforeEach(() => {
        login().then((t) => {
          token = t;
          cy.window().then((win) => win.localStorage.setItem('token', token));
        });
      });
      it('should access student detail with token', () => {
        cy.visit('/studentDetail/1');
        cy.url().should('include', '/studentDetail/1');
      });
    });

    describe('without token', () => {
      beforeEach(() => {
        cy.clearLocalStorage();
      });
      it('should redirect to login when accessing without token', () => {
        cy.visit('/studentDetail/1');
        cy.url().should('include', 'http://localhost:4200/');
      });
    });
  });

  describe('Student list page', () => {
    describe('with token', () => {
      beforeEach(() => {
        login().then((t) => {
          token = t;
          cy.window().then((win) => win.localStorage.setItem('token', token));
        });
      });
      it('should access student list with valid token', () => {
        cy.visit('/students');
        cy.url().should('include', '/students');
      });
      it('should navigate to student detail on button click', () => {
        cy.visit('/students');
        cy.get('[data-cy="studentListBtn"]').first().click();
        cy.url().should('include', '/studentDetail');
      });
    });

    describe('without token', () => {
      beforeEach(() => {
        cy.clearLocalStorage();
      });
      it('should redirect to login when accessing without token', () => {
        cy.visit('/students');
        cy.url().should('include', '/login');
      });
    });
  });
});
