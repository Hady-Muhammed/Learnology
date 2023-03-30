import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Post } from './../../../../app/models/post';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-notified-post',
  templateUrl: './notified-post.component.html',
  styleUrls: ['./notified-post.component.css'],
})
export class NotifiedPostComponent implements OnInit, OnDestroy {
  account!: Student;
  post!: Post;
  id!: any;
  subscription!: Subscription;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    window.scrollTo(0, 0);
    this.getAccount();
    this.getPost();
    this.route.params.subscribe(() => {
      this.id = this.route.snapshot.params['id'];
      this.getPost();
    });
  }

  ngOnInit(): void {}

  getAccount(): void {
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
      });
    this.subscription?.add(sub);
  }

  getPost(): void {
    const sub = this.http
      .get<Post[]>(API_URL + `/api/posts/getPost/${this.id}`)
      .subscribe((post: Post[]) => {
        this.post = post[0];
      });
    this.subscription?.add(sub);
  }

  refresh(emitted: boolean): void {
    if (emitted) this.getPost();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
