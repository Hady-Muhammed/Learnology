import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCardComponent implements OnInit {
  @Input('article') article!: Article;
  constructor() {}

  ngOnInit(): void {}
}
