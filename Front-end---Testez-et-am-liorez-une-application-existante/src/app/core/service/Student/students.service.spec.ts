import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { StudentsService } from './students.service';
import { Student } from '../../models/Student';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from '../../../interceptors/jwt.interceptor';

const mockStudent: Student = {
  id: 1,
  firstName: 'john',
  lastName: 'Doe',
  dateOfBirth: '1997-07-07',
};

describe('StudentsService', () => {
  let service: StudentsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentsService,
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(StudentsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create a student (POST)', () => {
    service.createStudent(mockStudent).subscribe((response) => {
      expect(response).toEqual(mockStudent);
    });

    const req = httpTesting.expectOne((req) =>
      req.url.endsWith('/api/student/create'),
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockStudent);
    req.flush(mockStudent);
  });

  it('should get all students (GET)', () => {
    const mockStudents: Student[] = [mockStudent];

    service.getAllStudents().subscribe((response) => {
      expect(response).toEqual(mockStudents);
    });

    const req = httpTesting.expectOne((req) =>
      req.url.endsWith('/api/student/getall'),
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockStudents);
  });

  it('should get student info by id (GET)', () => {
    service.getStudentInfo(1).subscribe((response) => {
      expect(response).toEqual(mockStudent);
    });

    const req = httpTesting.expectOne((req) =>
      req.url.endsWith('/api/student/getInfo/1'),
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockStudent);
  });

  it('should update a student (POST)', () => {
    service.updateStudent(mockStudent, 1).subscribe((response) => {
      expect(response).toEqual(mockStudent);
    });

    const req = httpTesting.expectOne((req) =>
      req.url.endsWith('/api/student/update/1'),
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockStudent);

    req.flush(mockStudent);
  });

  it('should delete a student (DELETE)', () => {
    service.deleteStudent(1).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpTesting.expectOne((req) =>
      req.url.endsWith('/api/student/delete/1'),
    );

    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
