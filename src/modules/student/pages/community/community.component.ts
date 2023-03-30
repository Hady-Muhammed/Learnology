import { Subscription } from 'rxjs';
import { FriendRequest } from './../../../../app/models/friendRequest';
import { NgToastService } from 'ng-angular-popup';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { comment, Post } from 'src/app/models/post';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
})
export class CommunityComponent implements OnInit, OnDestroy {
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
  subscription!: Subscription;

  constructor(
    private http: HttpClient,
    public router: Router,
    public toast: NgToastService
  ) {
    this.getAccount();
    this.getAllPosts();
  }

  ngOnInit(): void {}

  getAccount() {
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.getAllPendingRequests();
        this.getFriendRequests();
      });
    this.subscription?.add(sub);
  }

  getAllStudents() {
    const sub = this.http
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
    this.subscription?.add(sub);
  }

  createChat(studentID: string) {
    const sub = this.http
      .post(API_URL + '/api/chats/createChat', {
        chat: {
          person1_ID: this.account._id,
          person2_ID: studentID,
          newMessages: 0,
          messages: [],
        },
      })
      .subscribe((res: any) => {
        this.router.navigateByUrl(`/account/messages/${res.id}`);
      });
    this.subscription?.add(sub);
  }

  createPost() {
    if (this.content) {
      const sub = this.http
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
      this.subscription?.add(sub);
    } else {
      this.toast.error({ detail: 'You must enter content for post!' });
    }
  }

  getAllPosts() {
    const sub = this.http
      .get<Post[]>(API_URL + '/api/posts/getAllPosts')
      .subscribe((posts: Post[]) => (this.posts = posts));
    this.comments = [];
    this.subscription?.add(sub);
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
    const sub = this.http
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
    this.subscription?.add(sub);
  }

  getAllPendingRequests() {
    const sub = this.http
      .get<FriendRequest[]>(
        API_URL + `/api/frequests/getStudentRequests/${this.account._id}`
      )
      .subscribe((requests: FriendRequest[]) => {
        this.pendingRequests = requests;
        this.getAllStudents();
      });
    this.subscription?.add(sub);
  }

  getFriendRequests() {
    const sub = this.http
      .get<FriendRequest[]>(
        API_URL + `/api/frequests/getFriendRequests/${this.account._id}`
      )
      .subscribe((requests: FriendRequest[]) => {
        this.friendRequests = requests;
      });
    this.subscription?.add(sub);
  }

  acceptRequest(acceptedStudent: Student) {
    let friendReq = this.friendRequests.find(
      (req) => req.from === acceptedStudent._id && req.to === this.account._id
    );
    const sub = this.http
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
    this.subscription?.add(sub);
  }

  rejectRequest(rejectedStudent: Student) {
    let friendReq = this.friendRequests.find(
      (req) => req.from === rejectedStudent._id && req.to === this.account._id
    );
    const sub = this.http
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
          this.toast.error({ detail: err.message });
        },
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
