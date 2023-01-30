import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PannerComponent } from './panner.component';

describe('PannerComponent', () => {
  let component: PannerComponent;
  let fixture: ComponentFixture<PannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
