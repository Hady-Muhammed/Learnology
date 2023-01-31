import { ActivatedRoute } from '@angular/router';
import { Post } from './../../../../app/models/post';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-notified-post',
  templateUrl: './notified-post.component.html',
  styleUrls: ['./notified-post.component.css']
})
export class NotifiedPostComponent implements OnInit {
  account!: Student;
  post!: Post;
  id!: any;
  constructor(private http:HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.id = this.route.snapshot.params['id']
    this.getAccount()
    this.getPost()
  }

  getAccount() {
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student
      });
  }

  getPost() {
    this.http.get<Post[]>(API_URL + `/api/posts/getPost/${this.id}`)
    .subscribe((post: Post[]) => {this.post = post[0]})
  }

  refresh(emitted: boolean){
    if(emitted)
      this.getPost()
  }
}
