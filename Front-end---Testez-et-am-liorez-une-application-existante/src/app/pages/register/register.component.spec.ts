import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../core/service/User/user.service';
import { UserMockService } from '../../core/service/User/user-mock.service';
import { RouterLink } from '@angular/router';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterLink],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: UserService, useValue: new UserMockService() },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register with correct payload when form is valid', () => {
    const userService = TestBed.inject(UserService);
    jest.spyOn(userService, 'register').mockReturnValue(of({}));

    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'login',
      password: 'pwd123',
    });

    component.onSubmit();

    expect(userService.register).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      login: 'login',
      password: 'pwd123',
    });
  });

  it('should not call register when form is invalid', () => {
    const userService = TestBed.inject(UserService);
    jest.spyOn(userService, 'register').mockReturnValue(of({}));

    component.registerForm.setValue({
      firstName: '',
      lastName: '',
      login: '',
      password: '',
    });

    component.onSubmit();

    expect(userService.register).not.toHaveBeenCalled();
  });

  it('should reset form and submitted flag on reset', () => {
    component.submitted = true;

    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'login',
      password: 'pwd123',
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.registerForm.pristine).toBe(true);
  });
});
