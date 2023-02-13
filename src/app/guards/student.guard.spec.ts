import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { StudentGuard } from './student.guard';

describe('StudentGuard', () => {
  let guard: StudentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(StudentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
