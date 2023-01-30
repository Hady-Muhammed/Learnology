import { TestBed } from '@angular/core/testing';

import { QuestionGuard } from './question.guard';

describe('QuestionGuard', () => {
  let guard: QuestionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(QuestionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
