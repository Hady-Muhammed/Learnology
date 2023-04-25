import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-skeleton',
  templateUrl: './course-skeleton.component.html',
  styleUrls: ['./course-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
