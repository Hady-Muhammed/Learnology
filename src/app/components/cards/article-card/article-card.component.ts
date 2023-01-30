import { Article } from './../../../models/article';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.css']
})
export class ArticleCardComponent implements OnInit {
  @Input('article') article!: Article;
  constructor() { }

  ngOnInit(): void {
  }

}
