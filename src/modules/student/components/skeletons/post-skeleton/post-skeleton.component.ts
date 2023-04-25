import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post-skeleton',
  templateUrl: './post-skeleton.component.html',
  styleUrls: ['./post-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
