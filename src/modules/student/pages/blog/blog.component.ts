import { Student } from './../../../../app/models/student';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Article } from 'src/app/models/article';
import { API_URL } from 'src/app/services/socketio.service';

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
    this.getAccount();
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

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {});
  }
}
