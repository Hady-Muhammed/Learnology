import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSectionAccordionComponent } from './course-section-accordion.component';

describe('CourseSectionAccordionComponent', () => {
  let component: CourseSectionAccordionComponent;
  let fixture: ComponentFixture<CourseSectionAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseSectionAccordionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseSectionAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
