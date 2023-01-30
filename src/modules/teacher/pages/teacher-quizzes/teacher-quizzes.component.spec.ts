import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherQuizzesComponent } from './teacher-quizzes.component';

describe('TeacherQuizzesComponent', () => {
  let component: TeacherQuizzesComponent;
  let fixture: ComponentFixture<TeacherQuizzesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherQuizzesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
