import { Student } from 'src/app/models/student';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Post } from 'src/app/models/post';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {

  myPosts!: Post[];
  account!: Student;

  constructor(private http: HttpClient) {
    this.getAccount()
  }

  ngOnInit(): void {
  }

  getAccount() {
    const token: string = localStorage.getItem('token') || ""
    const student: any = jwtDecode(token)
    this.http.get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
    .subscribe((student: Student) => {
      this.account = student;
      this.getMyPosts()
    })
  }

  getMyPosts() {
    this.http.get<Post[]>(API_URL + `/api/posts/getPostsOfAStudent/${this.account._id}`)
    .subscribe((posts: Post[]) => this.myPosts = posts)
  }

  refresh(emitted: boolean){
    if(emitted)
      this.getMyPosts()
  }
}
