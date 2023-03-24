import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Teacher } from './../models/teacher';
import { of } from 'rxjs';
import { ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';

import { StudentGuard } from './student.guard';
import { routes } from '../app-routing.module';

describe('StudentGuard', () => {
  let guard: StudentGuard;
  let authService: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        AuthService,
      ],
    });
    guard = TestBed.inject(StudentGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  // describe('canActivate()', () => {
  //   it('should', () => {
  //     // expect().toBe();
  //   });
  // });

  // describe('isStudent()', () => {
  //   it('should return false if signed in user is a teacher', () => {
  //     let mockTeacher: Teacher = {
  //       _id: '',
  //       name: '',
  //       email: '',
  //       password: '',
  //       title: '',
  //       picture: '',
  //       courses_teaching: [],
  //       createdAt: '',
  //       articles_published: [],
  //       quizzes_published: [],
  //       likes: 0,
  //       online: false,
  //       last_activity: '',
  //     };
  //     spyOn(authService, 'getTeacher').and.returnValue(of(mockTeacher));
  //     guard.isStudent()?.subscribe((found) => {
  //       expect(found).toBe(false);
  //     });
  //   });
  //   it('should return true if signed in user is a student', () => {
  //     spyOn(authService, 'getTeacher').and.returnValue(null);
  //     expect(guard.isStudent()).toBeFalsy();
  //   });
  // });

  // it('should ', () => {
  //   expect().toBe();
  // });
});
