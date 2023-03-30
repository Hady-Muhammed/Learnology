import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Post } from 'src/app/models/post';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit, OnDestroy {
  myPosts!: Post[];
  account!: Student;
  subscription!: Subscription;

  constructor(private http: HttpClient) {
    this.getAccount();
  }

  ngOnInit(): void {}

  getAccount(): void {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.getMyPosts();
      });
    this.subscription?.add(sub);
  }

  getMyPosts(): void {
    const sub = this.http
      .get<Post[]>(
        API_URL + `/api/posts/getPostsOfAStudent/${this.account._id}`
      )
      .subscribe((posts: Post[]) => (this.myPosts = posts));
    this.subscription?.add(sub);
  }

  refresh(emitted: boolean): void {
    if (emitted) this.getMyPosts();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
