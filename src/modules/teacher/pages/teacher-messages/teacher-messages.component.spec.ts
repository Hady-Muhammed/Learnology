import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherMessagesComponent } from './teacher-messages.component';

describe('TeacherMessagesComponent', () => {
  let component: TeacherMessagesComponent;
  let fixture: ComponentFixture<TeacherMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
