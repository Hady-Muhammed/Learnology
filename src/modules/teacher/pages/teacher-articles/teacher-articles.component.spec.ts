import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherArticlesComponent } from './teacher-articles.component';

describe('TeacherArticlesComponent', () => {
  let component: TeacherArticlesComponent;
  let fixture: ComponentFixture<TeacherArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherArticlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
