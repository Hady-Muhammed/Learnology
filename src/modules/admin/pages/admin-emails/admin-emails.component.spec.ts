import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailsComponent } from './admin-emails.component';

describe('AdminEmailsComponent', () => {
  let component: AdminEmailsComponent;
  let fixture: ComponentFixture<AdminEmailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEmailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
