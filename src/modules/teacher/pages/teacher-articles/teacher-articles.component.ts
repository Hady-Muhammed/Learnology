import { API_URL } from './../../../../app/services/socketio.service';
import { NgToastService } from 'ng-angular-popup';
import { Article } from './../../../../app/models/article';
import { Teacher } from './../../../../app/models/teacher';
import jwtDecode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher-articles',
  templateUrl: './teacher-articles.component.html',
  styleUrls: ['./teacher-articles.component.css'],
})
export class TeacherArticlesComponent implements OnInit {
  account!: Teacher;
  articles!: Article[];
  constructor(private http: HttpClient, public toast: NgToastService) {
    this.getAccount();
  }

  ngOnInit(): void {
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.getArticles(teacher.articles_published);
      });
  }

  getArticles(articles: string[]) {
    this.http
      .post<Article[]>(API_URL + '/api/articles/getArticlesByIds', {
        articles,
      })
      .subscribe((articles: Article[]) => (this.articles = articles));
  }

  deleteArticle(id: string) {
    this.http
      .post(API_URL + `/api/articles/deleteArticle`, {
        id,
        email: this.account.email,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getAccount();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }
}
