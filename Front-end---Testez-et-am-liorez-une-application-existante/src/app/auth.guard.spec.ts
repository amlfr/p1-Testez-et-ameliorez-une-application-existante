import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const routeMock = {} as ActivatedRouteSnapshot;
  const stateMock = {} as RouterStateSnapshot;

  const runGuard = () =>
    TestBed.runInInjectionContext(() => authGuard(routeMock, stateMock));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow access when token exists', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
    expect(runGuard()).toBe(true);
  });
});
