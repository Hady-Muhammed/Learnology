import { NgToastService } from 'ng-angular-popup';
import { FriendRequest } from './../../../../../../app/models/friendRequest';
import { Observable } from 'rxjs';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent implements OnInit {
  friends!: Observable<Student[]>;
  friendRequests!: FriendRequest[];
  account!: Student;
  showRequests!: boolean;
  opened!: boolean;
  numOfUnreadRequests!: number

  constructor(private http: HttpClient, private toast: NgToastService) {
    this.getAccount();
  }

  ngOnInit(): void {}

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.getFriends();
        this.getNoOfUnreadFriendRequests();
      });
  }

  getFriends() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.friends = this.http.get<Student[]>(
      API_URL + `/api/students/getFriends/${student.email}`
    );
  }

  getFriendRequests() {
    this.http
      .get<FriendRequest[]>(
        API_URL + `/api/frequests/getFriendRequests/${this.account._id}`
      )
      .subscribe((requests: FriendRequest[]) => {
        console.log(requests);
        this.friendRequests = requests;
        this.numOfUnreadRequests = 0;
      });
  }

  openRequests() {
    this.showRequests = true;
    this.getFriendRequests();
  }

  acceptRequest(acceptedStudent: Student, requestID: string) {
    this.http
      .post(API_URL + '/api/frequests/acceptRequest', {
        person1: this.account,
        person2: acceptedStudent,
        requestID,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getFriendRequests();
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  rejectRequest(requestID: string) {
    this.http.post(API_URL + '/api/frequests/rejectRequest', {
      requestID,
    }).subscribe({
      next: (res:any) => {
        this.toast.success({detail: res.message})
        this.getFriendRequests()
      },
      error: err => {
        this.toast.success({detail: err.message})
      }
    })
  }

  getNoOfUnreadFriendRequests() {
    this.http.get<any>(API_URL + `/api/frequests/getNoOfUnreadFriendRequests/${this.account._id}`)
    .subscribe((res: any) =>{
      console.log(res)
      this.numOfUnreadRequests = res.numOfRequests
    })
  }
}
