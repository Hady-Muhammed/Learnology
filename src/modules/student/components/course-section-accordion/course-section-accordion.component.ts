import { Component, Input, OnInit } from '@angular/core';
import { section } from 'src/app/models/course';

@Component({
  selector: 'app-course-section-accordion',
  templateUrl: './course-section-accordion.component.html',
  styleUrls: ['./course-section-accordion.component.css']
})
export class CourseSectionAccordionComponent implements OnInit {
  panelOpenState = false;
  @Input("section") section!: section
  constructor() { }

  ngOnInit(): void {
  }

}
