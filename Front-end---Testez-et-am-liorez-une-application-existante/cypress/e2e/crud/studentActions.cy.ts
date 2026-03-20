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

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

describe('File containin all the e2e tests for the student API', () => {
  let token: string;
  let createdStudentId: number;
  before(() => {
    login().then((t) => {
      token = t;
      localStorage.setItem('token', token);
    });
  });
  after(() => localStorage.removeItem('token'));

  describe('Create student API', () => {
    it('should successfully creates a new student', () => {
      cy.request({
        method: 'POST',
        url: '/api/student/create',
        headers: authHeader(token),
        body: student,
      }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.have.property('id');
        createdStudentId = res.body.id;
      });
    });

    it('should fail to create a new student when not providing all the infos', () => {
      cy.request({
        method: 'POST',
        url: '/api/student/create',
        headers: authHeader(token),
        body: {},
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(500);
      });
    });

    it('should fail to create a new student when not providing the jwtoken', () => {
      cy.request({
        method: 'POST',
        url: '/api/student/create',
        body: student,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe('Read students API', () => {
    it('sgould fetch all the students', () => {
      cy.request({
        method: 'GET',
        url: '/api/student/getall',
        headers: authHeader(token),
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
      });
    });

    it('should fail to fetch all students when not providing jwt', () => {
      cy.request({
        method: 'GET',
        url: '/api/student/getall',
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });

    it('should fetch an individual student', () => {
      cy.request({
        method: 'GET',
        url: `/api/student/getInfo/${createdStudentId}`,
        headers: authHeader(token),
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('id', createdStudentId);
      });
    });

    it('should fail to fetch an individual student when not providing jwtoken', () => {
      cy.request({
        method: 'GET',
        url: `/api/student/getInfo/${createdStudentId}`,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe('Update Student API', () => {
    it('should successfully update a student informations', () => {
      cy.request({
        method: 'POST',
        url: `/api/student/update/${createdStudentId}`,
        headers: authHeader(token),
        body: updatedStudent,
      }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body.lastName).to.eq(updatedStudent.lastName);
      });
    });

    it('should fail to update a student when not providing a jwtoken', () => {
      cy.request({
        method: 'POST',
        url: `/api/student/update/${createdStudentId}`,
        body: updatedStudent,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401);
      });
    });
  });

  describe('Delete Student API', () => {
    it('should successfully delete a student', () => {
      cy.request({
        method: 'DELETE',
        url: `/api/student/delete/${createdStudentId}`,
        headers: authHeader(token),
      }).then((res) => {
        expect(res.status).to.eq(204);
      });
    });

    it('Should fail to delete a student when not providing a jwtoken', () => {
      cy.request({
        method: 'POST',
        url: '/api/student/create',
        headers: authHeader(token),
        body: {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1997-07-07',
        },
      }).then((createRes) => {
        const throwawayId = createRes.body.id;
        cy.request({
          method: 'DELETE',
          url: `/api/student/delete/${throwawayId}`,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).to.eq(401);
        });
      });
    });
  });
});
