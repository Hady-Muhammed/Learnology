import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCreateArticleComponent } from './teacher-create-article.component';

describe('TeacherCreateArticleComponent', () => {
  let component: TeacherCreateArticleComponent;
  let fixture: ComponentFixture<TeacherCreateArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherCreateArticleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCreateArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
