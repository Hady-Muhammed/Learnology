import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-article-skeleton',
  templateUrl: './article-skeleton.component.html',
  styleUrls: ['./article-skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
