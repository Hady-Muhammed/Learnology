import { Teacher } from './../models/teacher';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getTeacher']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: spy }
      ],
    });
    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should return true when the user is a student', () => {
    authServiceSpy.getTeacher.and.returnValue(of());
    expect(guard.canActivate()).toBeTruthy()
  });

  it('should return false and navigate to /teacher when the user is a teacher', () => {
    localStorage.setItem("token",'mocktoken')
    let mockTeacher: Teacher = {
      _id: '',
      name: '',
      email: '',
      password: '',
      title: '',
      picture: '',
      courses_teaching: [],
      createdAt: '',
      articles_published: [],
      quizzes_published: [],
      likes: 0,
      online: false,
      last_activity: ''
    }
    authServiceSpy.getTeacher.and.returnValue(of(mockTeacher));
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    expect(guard.canActivate()).toBeTruthy()
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/teacher');
  });

  it('should navigate to /signin when there is no token', () => {
    localStorage.removeItem('token');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    expect(guard.canActivate()).toBeFalsy()
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/signin');
  });

  it('should navigate to /signin when the token is invalid', () => {
    localStorage.setItem('token', 'invalid_token');
    const navigateByUrlSpy = spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));

    expect(guard.canActivate()).toBeFalsy()
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/signin');
  });
});
