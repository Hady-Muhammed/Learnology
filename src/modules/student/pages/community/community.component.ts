import { NgToastService } from 'ng-angular-popup';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { comment, Post } from 'src/app/models/post';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
})
export class CommunityComponent implements OnInit {
  students!: Student[];
  account!: Student;
  opened!: boolean;
  imageURL!: string;
  openedUpload!: boolean;
  reactListOpened!: boolean;
  content!: string;
  comments!: comment[];
  type!: string;
  refreshing!: boolean;
  posts!: Post[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService,
    private cd: ChangeDetectorRef
  ) {
    this.getAllStudents();
    this.getAccount();
    this.getAllPosts();
  }

  ngOnInit(): void {}

  getAccount() {
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => (this.account = student));
  }

  getAllStudents() {
    this.http
      .get<Student[]>(API_URL + '/api/students/getAllStudents')
      .subscribe((students: Student[]) => (this.students = students));
  }

  createChat(name: string, email: string, picture: string) {
    this.http
      .post(API_URL + '/api/chats/createChat', {
        chat: {
          person1: {
            picture: this.account.picture,
            name: this.account.name,
            email: this.account.email,
          },
          person2: {
            picture: picture,
            name: name,
            email: email,
          },
          newMessages: 0,
          messages: [],
        },
      })
      .subscribe((res: any) => {
        if (res.message === 'Chat already exists') {
          console.log(res);
          this.router.navigateByUrl(`/account/messages/${res.id}`);
        } else {
          console.log(res);
          this.router.navigateByUrl(`/account/messages/${res.id}`);
        }
      });
  }

  createPost() {
    if (this.content) {
      this.http
        .post(API_URL + '/api/posts/createPost', {
          postt: {
            authorID: this.account._id,
            image: this.imageURL,
            publishedAt: new Date().toUTCString(),
            content: this.content,
            comments: 0,
            reacts: 0,
            postHasLikes: false,
            postHasLoves: false,
            postHasWows: false,
          },
        })
        .subscribe({
          next: (res: any) => {
            this.toast.success({ detail: res.message });
            this.opened = false;
            this.getAllPosts();
          },
          error: (err) => {
            this.toast.error({ detail: err.message });
          },
        });
    } else {
      this.toast.error({ detail: 'You must enter content for post!' });
    }
  }

  getAllPosts() {
    this.http
      .get<Post[]>(API_URL + '/api/posts/getAllPosts')
      .subscribe((posts: Post[]) => (this.posts = posts));
    this.comments = [];
  }

  trackPosts(index: any, post: Post) {
    return post._id;
  }

  refreshPosts() {
    this.refreshing = true;
    this.getAllPosts();
    setTimeout(() => {
      this.refreshing = false;
    }, 2000);
  }

  refresh(emitted: boolean){
    if(emitted)
      this.getAllPosts()
  }
}
