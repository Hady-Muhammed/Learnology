import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherInboxDetailComponent } from './teacher-inbox-detail.component';

describe('TeacherInboxDetailComponent', () => {
  let component: TeacherInboxDetailComponent;
  let fixture: ComponentFixture<TeacherInboxDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherInboxDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherInboxDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
