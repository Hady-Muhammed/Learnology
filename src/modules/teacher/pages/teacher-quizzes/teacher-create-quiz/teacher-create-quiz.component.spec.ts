import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCreateQuizComponent } from './teacher-create-quiz.component';

describe('TeacherCreateQuizComponent', () => {
  let component: TeacherCreateQuizComponent;
  let fixture: ComponentFixture<TeacherCreateQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherCreateQuizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCreateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
