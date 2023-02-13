import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
})
export class ArticleDetailComponent implements OnInit {
  article!: Article;
  id: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private socketService: SocketioService
  ) {
    this.id = route.snapshot.params['id'];
    window.scrollTo(0, 0);
    this.getArticle();
    this.getAccount();
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

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.socketService.online(student._id);
        this.socketService.setupSocketConnection(student.email);
      });
  }
}
