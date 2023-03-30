import { Student } from './../../../../app/models/student';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Article } from 'src/app/models/article';
import { API_URL } from 'src/app/services/socketio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit , OnDestroy {
  articles!: any;
  filteredArticles!: any;
  category!: any;
  subscription!: Subscription
  constructor(private http: HttpClient) {
    window.scrollTo(0, 0);
    this.getAllArticles();
  }

  ngOnInit(): void {}

  getAllArticles() {
    this.subscription = this.http
      .get<Article[]>(API_URL + '/api/articles/getAllArticles')
      .subscribe((articles: Article[]) => {
        this.articles = articles;
        this.filteredArticles = articles;
      });
  }

  changeCategory(e: any) {
    this.category = e.target?.innerText;
    this.filteredArticles = this.articles.filter(
      (art: Article) => art.category === this.category
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
