import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { QuestionGuard } from './question.guard';

describe('QuestionGuard', () => {
  let guard: QuestionGuard;
  let router: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [QuestionGuard],
    });
    guard = TestBed.inject(QuestionGuard);
    router = TestBed.inject(Router);
    mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = {} as RouterStateSnapshot;
  });

  it('should allow deactivation if the next question number is greater than or equal to the current question number', () => {
    const mockComponent: any = {};
    const currentUrl = '/questions/1';
    const nextUrl = '/questions/2';
    mockRouterStateSnapshot.url = currentUrl;
    const nextState: RouterStateSnapshot = {
      url: nextUrl,
    } as RouterStateSnapshot;

    const result = guard.canDeactivate(
      mockComponent,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      nextState
    );

    expect(result).toBe(true);
  });

  it('should not allow deactivation if the next question number is less than the current question number', () => {
    const mockComponent: any = {};
    const currentUrl = '/questions/2';
    const nextUrl = '/questions/1';
    mockRouterStateSnapshot.url = currentUrl;
    const nextState: RouterStateSnapshot = {
      url: nextUrl,
    } as RouterStateSnapshot;

    const result = guard.canDeactivate(
      mockComponent,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      nextState
    );

    expect(result).toBe(false);
  });

  it('should not allow deactivation if urls not found', () => {
    const mockComponent: any = {};
    const currentUrl = '';
    const nextUrl = '';
    mockRouterStateSnapshot.url = currentUrl;
    const nextState: RouterStateSnapshot = {
      url: nextUrl,
    } as RouterStateSnapshot;

    const result = guard.canDeactivate(
      mockComponent,
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot,
      nextState
    );

    expect(result).toBe(false);
  });

});
