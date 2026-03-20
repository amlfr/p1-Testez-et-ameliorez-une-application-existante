import { TestBed } from '@angular/core/testing';
import { StudentListComponent } from './student-list.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentsService } from '../../core/service/Student/students.service';
import { of } from 'rxjs';

describe('StudentListComponent', () => {
  let component: StudentListComponent;

  const studentServiceMock = {
    createStudent: jest.fn(),
    getAllStudents: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    studentServiceMock.getAllStudents.mockReturnValue(of([]));

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        StudentListComponent,
        { provide: StudentsService, useValue: studentServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    component = TestBed.inject(StudentListComponent);
    component.ngOnInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create student on submit when form is valid', () => {
    window.alert = jest.fn();
    component.studentForm.setValue({
      firstName: 'Jane',
      lastName: 'Doe',
      dateOfBirth: '1999-01-01',
    });
    studentServiceMock.createStudent.mockReturnValue(of({}));
    studentServiceMock.getAllStudents.mockReturnValue(of([]));
    const loadSpy = jest.spyOn(component, 'loadAllStudent');
    component.onSubmit();
    expect(studentServiceMock.createStudent).toHaveBeenCalledWith(
      component.studentForm.value,
    );
    expect(loadSpy).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('SUCCESS!! :-)');
  });

  it('should navigate to student detail on getStudentInfo', () => {
    component.getStudentInfo(42);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/studentDetail', 42]);
  });

  it('should logout and redirect to login', () => {
    const removeSpy = jest.spyOn(Storage.prototype, 'removeItem');
    component.logout();
    expect(removeSpy).toHaveBeenCalledWith('token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
