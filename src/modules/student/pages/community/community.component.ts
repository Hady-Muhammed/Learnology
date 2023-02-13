import { FriendRequest } from './../../../../app/models/friendRequest';
import { NgToastService } from 'ng-angular-popup';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  pendingRequests!: FriendRequest[];
  friendRequests!: FriendRequest[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService
  ) {
    this.getAccount();
    this.getAllPosts();
  }

  ngOnInit(): void {}

  getAccount() {
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.getAllPendingRequests();
        this.getFriendRequests();
      });
  }

  getAllStudents() {
    this.http
      .get<Student[]>(API_URL + '/api/students/getAllStudents')
      .subscribe((students: Student[]) => {
        this.students = students;
        for (let i = 0; i < students.length; i++) {
          let pendingReqFound = this.pendingRequests.find(
            (req) => req.to === students[i]._id && req.from === this.account._id
          );
          let friendReqFound = this.friendRequests.find(
            (req) => req.from === students[i]._id && req.to === this.account._id
          );
          let alreadyAFriend = this.students[i].friends.find(
            (id) => this.account._id === id
          );
          if (alreadyAFriend) {
            this.students[i].alreadyFriend = true;
          } else {
            this.students[i].alreadyFriend = false;
            if (pendingReqFound) {
              students[i].pendingRequest = true;
            } else {
              students[i].pendingRequest = false;
            }
            if (friendReqFound) {
              students[i].friendRequest = true;
            } else {
              students[i].friendRequest = false;
            }
          }
        }
      });
  }

  createChat(studentID: string) {
    this.http
      .post(API_URL + '/api/chats/createChat', {
        chat: {
          person1_ID: this.account._id,
          person2_ID: studentID,
          newMessages: 0,
          messages: [],
        },
      })
      .subscribe((res: any) => {
        if (res.message === 'Chat already exists') {
          this.router.navigateByUrl(`/account/messages/${res.id}`);
        } else {
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

  refresh(emitted: boolean) {
    if (emitted) this.getAllPosts();
  }

  sendFriendRequest(addedStudent: Student) {
    this.http
      .post(API_URL + '/api/frequests/sendFriendRequest', {
        request: {
          to: addedStudent._id,
          from: this.account._id,
          read: false,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getAllPendingRequests();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  getAllPendingRequests() {
    this.http
      .get<FriendRequest[]>(
        API_URL + `/api/frequests/getStudentRequests/${this.account._id}`
      )
      .subscribe((requests: FriendRequest[]) => {
        this.pendingRequests = requests;
        this.getAllStudents();
      });
  }

  getFriendRequests() {
    this.http
      .get<FriendRequest[]>(
        API_URL + `/api/frequests/getFriendRequests/${this.account._id}`
      )
      .subscribe((requests: FriendRequest[]) => {
        this.friendRequests = requests;
      });
  }

  acceptRequest(acceptedStudent: Student) {
    let friendReq = this.friendRequests.find(
      (req) => req.from === acceptedStudent._id && req.to === this.account._id
    );
    this.http
      .post(API_URL + '/api/frequests/acceptRequest', {
        person1: this.account,
        person2: acceptedStudent,
        requestID: friendReq?._id,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getFriendRequests();
          this.getAllPendingRequests();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  rejectRequest(rejectedStudent: Student) {
    let friendReq = this.friendRequests.find(
      (req) => req.from === rejectedStudent._id && req.to === this.account._id
    );
    this.http
      .post(API_URL + '/api/frequests/rejectRequest', {
        requestID: friendReq?._id,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getFriendRequests();
          this.getAllPendingRequests();
        },
        error: (err) => {
          this.toast.success({ detail: err.message });
        },
      });
  }
}
