import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxCardComponent } from './inbox-card.component';

describe('InboxCardComponent', () => {
  let component: InboxCardComponent;
  let fixture: ComponentFixture<InboxCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InboxCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InboxCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
