describe('Student E2E (UI)', () => {
  const student = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2011-07-07',
  };

  const updatedStudent = {
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '2011-05-05',
  };

  const login = () =>
    cy
      .request('POST', '/api/login', { login: 'aml2', password: '12345' })
      .its('body.token');

  let token: string;

  beforeEach(() => {
    login().then((t) => {
      token = t;
      cy.window().then((win) => win.localStorage.setItem('token', token));
    });
  });
  describe('Create student (UI)', () => {
    it('should create a student via the form', () => {
      cy.visit('/students');

      cy.get('#firstName').type(student.firstName);
      cy.get('#lastName').type(student.lastName);
      cy.get('#dateOfBirth').type(student.dateOfBirth);

      cy.contains('Add student').click();

      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('SUCCESS');
      });
      cy.contains(student.lastName).should('exist');
    });

    it('should not allow submit when form is invalid', () => {
      cy.visit('/students');

      cy.contains('Add student').should('be.disabled');
    });
  });
  describe('Read students (UI)', () => {
    it('should display students list', () => {
      cy.visit('/students');

      cy.get('[data-cy="studentListBtn"]').should('have.length.greaterThan', 0);
    });

    it('should navigate to student detail page', () => {
      cy.visit('/students');

      cy.get('[data-cy="studentListBtn"]').first().click();

      cy.url().should('match', /\/studentDetail\/\d+$/);

      cy.contains('Student informations').should('exist');
    });
  });

  describe('Update student (UI)', () => {
    it('should update student info from detail page', () => {
      cy.visit('/students');

      cy.get('[data-cy="studentListBtn"]').first().click();

      cy.get('#firstName').clear().type(updatedStudent.firstName);
      cy.get('#lastName').clear().type(updatedStudent.lastName);
      cy.get('#dateOfBirth').clear().type(updatedStudent.dateOfBirth);

      cy.contains('Update').click();

      cy.contains(updatedStudent.lastName).should('exist');
    });
  });

  describe('Delete student (UI)', () => {
    it('should delete a student from detail page', () => {
      cy.visit('/students');

      cy.get('[data-cy="studentListBtn"]')
        .first()
        .parent()
        .find('span')
        .invoke('text')
        .then((name) => {
          cy.wrap(name).as('studentName');
        });

      cy.get('[data-cy="studentListBtn"]').first().click();

      cy.contains('Delete').click();

      cy.visit('/students');

      cy.get('@studentName').then((name) => {
        cy.contains(name as string).should('not.exist');
      });
    });
  });

  describe('Auth behavior (UI)', () => {
    it('should redirect to login without token', () => {
      cy.clearLocalStorage();

      cy.visit('/students');

      cy.url().should('include', '/login');
    });

    it('should logout and redirect', () => {
      cy.visit('/students');

      cy.contains('Disconnect').click();

      cy.url().should('include', '/login');
    });
  });
});
