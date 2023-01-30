import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactsPopupComponent } from './reacts-popup.component';

describe('ReactsPopupComponent', () => {
  let component: ReactsPopupComponent;
  let fixture: ComponentFixture<ReactsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
