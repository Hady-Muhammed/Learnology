import { API_URL } from './../../services/socketio.service';
import { Article } from './../../models/article';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  articles!: any;
  filteredArticles!: any;
  category!: any;
  constructor(private http: HttpClient) {
    this.getAllArticles();
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {}

  getAllArticles() {
    this.http
      .get<Article[]>(API_URL + '/api/articles/getAllArticles')
      .subscribe((articles: Article[]) => {
        this.articles = articles;
        this.filteredArticles = articles;
      });
  }

  changeCategory(e: any) {
    this.category = e.target.innerText;
    this.filteredArticles = this.articles.filter(
      (art: Article) => art.category === this.category
    );
  }
}
