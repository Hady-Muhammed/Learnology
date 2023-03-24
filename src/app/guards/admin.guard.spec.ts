import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AdminGuard],
    });
    guard = TestBed.inject(AdminGuard);
    router = TestBed.inject(Router);
  });

  it('should return true if the user is an admin', () => {
    const mockToken = { email: 'admin@gmail.com', password: 'admin' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockToken));

    const result = guard.canActivate();

    expect(result).toBeTrue();
  });

  it('should redirect to the signin page if the user is not an admin', () => {
    const mockToken = { email: 'user@gmail.com', password: 'password' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockToken));
    spyOn(router, 'navigate');

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
  });

  it('should redirect to the signin page if there is no token', () => {
    spyOn(localStorage, 'getItem').and.returnValue('');
    spyOn(router, 'navigate');

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
  });
});
