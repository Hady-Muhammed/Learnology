import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailDetailComponent } from './admin-email-detail.component';

describe('AdminEmailDetailComponent', () => {
  let component: AdminEmailDetailComponent;
  let fixture: ComponentFixture<AdminEmailDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEmailDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEmailDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
