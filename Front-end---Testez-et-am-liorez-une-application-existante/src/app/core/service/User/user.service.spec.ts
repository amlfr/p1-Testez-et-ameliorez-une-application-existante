import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Register, Login, LoginResponse } from '../../models/Authentication';

const mockRegisterCredentials: Register = {
  login: 'username',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
};

const mockLoginCredentials: Login = {
  login: 'username',
  password: 'password123',
};

const mockLoginResponse: LoginResponse = {
  token: 'jwt-test-token',
};

describe('UserService', () => {
  let service: UserService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(UserService);
    httpTesting = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should register a user (POST)', () => {
    service.register(mockRegisterCredentials).subscribe((response) => {
      expect(response).toEqual(mockRegisterCredentials);
    });

    const req = httpTesting.expectOne((req) =>
      req.url.endsWith('/api/register'),
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterCredentials);

    req.flush(mockRegisterCredentials);
  });

  it('should login a user and store the token (POST)', () => {
    service.login(mockLoginCredentials).subscribe((response) => {
      expect(response).toEqual(mockLoginResponse);
      expect(localStorage.getItem('token')).toBe('jwt-test-token');
    });

    const req = httpTesting.expectOne((req) => req.url.endsWith('api/login'));

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginCredentials);

    req.flush(mockLoginResponse);
  });
});
