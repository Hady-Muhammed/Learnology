import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { section } from 'src/app/models/course';

@Component({
  selector: 'app-course-section-accordion',
  templateUrl: './course-section-accordion.component.html',
  styleUrls: ['./course-section-accordion.component.css'],
})
export class CourseSectionAccordionComponent implements OnInit {
  panelOpenState = false;
  @Input('section') section!: section;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.navigate([this.section._id, this.section.videos[0]._id], {
      relativeTo: this.route,
    });
  }
}
