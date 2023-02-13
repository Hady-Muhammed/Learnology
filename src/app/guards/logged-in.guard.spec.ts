import { TestBed } from '@angular/core/testing';

import { LoggedInGuard } from './logged-in.guard';

describe('LoggedInGuard', () => {
  let guard: LoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedInGuard);
    localStorage.setItem("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImhhZHlAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjMxMjMiLCJpYXQiOjE2NzYyMDUyMDIsImV4cCI6MTY3NjgxMDAwMn0.VBMyE8n7GE5sN6vXVU8UizKfBEnI0hxhLBbrCPegQ3M")
  });

  afterEach(() => {
    localStorage.removeItem("token")
  })

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should activate the route if theres no token', () => {
    localStorage.removeItem("token")
    expect(guard.canActivate()).toBe(true);
  });

  it('should not activate the route if theres a token', () => {
    expect(guard.canActivate()).toBe(false);
  });
});
