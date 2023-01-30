import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherModifyQuizComponent } from './teacher-modify-quiz.component';

describe('TeacherModifyQuizComponent', () => {
  let component: TeacherModifyQuizComponent;
  let fixture: ComponentFixture<TeacherModifyQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherModifyQuizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherModifyQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
