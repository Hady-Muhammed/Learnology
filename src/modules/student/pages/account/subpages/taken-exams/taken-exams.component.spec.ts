import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakenExamsComponent } from './taken-exams.component';

describe('TakenExamsComponent', () => {
  let component: TakenExamsComponent;
  let fixture: ComponentFixture<TakenExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakenExamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakenExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
