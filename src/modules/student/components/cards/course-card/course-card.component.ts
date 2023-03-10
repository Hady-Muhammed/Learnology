import { Course } from './../../../../../app/models/course';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css'],
})
export class CourseCardComponent implements OnInit {
  @Input('course') course!: Course;

  ngOnInit(): void {}
}
