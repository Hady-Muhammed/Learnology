import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifiedPostComponent } from './notified-post.component';

describe('NotifiedPostComponent', () => {
  let component: NotifiedPostComponent;
  let fixture: ComponentFixture<NotifiedPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifiedPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifiedPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
