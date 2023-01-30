import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherModifyArticleComponent } from './teacher-modify-article.component';

describe('TeacherModifyArticleComponent', () => {
  let component: TeacherModifyArticleComponent;
  let fixture: ComponentFixture<TeacherModifyArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherModifyArticleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherModifyArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
