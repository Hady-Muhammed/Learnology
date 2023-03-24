import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
})
export class ArticleDetailComponent implements OnInit {
  article!: Article;
  id: string;

  constructor(
    public route: ActivatedRoute,
    private http: HttpClient,
  ) {
    this.id = this.route.snapshot.params['id'];
    window.scrollTo(0, 0);
    this.getArticle();
  }

  ngOnInit(): void {}

  getArticle() {
    this.http
      .get<Article>(API_URL + `/api/articles/getArticle/${this.id}`)
      .subscribe((article: Article) => (this.article = article));
  }

  return() {
    window.history.back();
  }
}
