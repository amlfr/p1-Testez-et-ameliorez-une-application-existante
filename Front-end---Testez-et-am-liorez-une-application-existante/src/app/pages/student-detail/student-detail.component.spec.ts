import { TestBed } from '@angular/core/testing';
import { StudentDetailComponent } from './student-detail.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentsService } from '../../core/service/Student/students.service';
import { of } from 'rxjs';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;

  const studentServiceMock = {
    updateStudent: jest.fn(),
    deleteStudent: jest.fn(),
    getStudentInfo: jest.fn(),
  };

  const routerMock = {
    navigate: jest.fn(),
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('1'),
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        StudentDetailComponent,
        { provide: StudentsService, useValue: studentServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });

    component = TestBed.inject(StudentDetailComponent);
    component.studentId = 1;
    component.initForm();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update student on submit when form is valid', () => {
    window.alert = jest.fn();
    component.studentForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1997-07-07',
    });
    studentServiceMock.updateStudent.mockReturnValue(of({}));
    studentServiceMock.getStudentInfo.mockReturnValue(of({}));
    const loadSpy = jest.spyOn(component, 'loadStudent');
    component.onSubmit();
    expect(studentServiceMock.updateStudent).toHaveBeenCalledWith(
      component.studentForm.value,
      1,
    );
    expect(loadSpy).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Student updated successfully');
  });

  it('should delete student when confirmed', () => {
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
    studentServiceMock.deleteStudent.mockReturnValue(of(null));
    component.deleteStudent();
    expect(studentServiceMock.deleteStudent).toHaveBeenCalledWith(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('should logout and redirect to login', () => {
    const removeSpy = jest.spyOn(Storage.prototype, 'removeItem');
    component.logout();
    expect(removeSpy).toHaveBeenCalledWith('token');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
