import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactsListComponent } from './reacts-list.component';

describe('ReactsListComponent', () => {
  let component: ReactsListComponent;
  let fixture: ComponentFixture<ReactsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
