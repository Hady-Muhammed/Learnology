import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherModifyCourseComponent } from './teacher-modify-course.component';

describe('TeacherModifyCourseComponent', () => {
  let component: TeacherModifyCourseComponent;
  let fixture: ComponentFixture<TeacherModifyCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherModifyCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherModifyCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
