import { Subscription } from 'rxjs';
import { Chat } from 'src/app/models/chat';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit, OnDestroy {
  account!: Student;
  numOfUnreadRequests!: number;
  numOfUnreadMessages: number = 0;
  numOfUnreadInboxes!: number;
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
        this.getNoOfUnreadFriendRequests();
        this.getNoOfUnreadMessages();
        this.getNoOfUnreadInboxes();
      });
    this.subscription?.add(sub);
  }

  getNoOfUnreadFriendRequests(): void {
    const sub = this.http
      .get<any>(
        API_URL +
          `/api/frequests/getNoOfUnreadFriendRequests/${this.account._id}`
      )
      .subscribe((res: any) => {
        this.numOfUnreadRequests = res.numOfRequests;
      });
    this.subscription?.add(sub);
  }

  getNoOfUnreadMessages(): void {
    const sub = this.http
      .get<Chat[]>(API_URL + `/api/chats/getChats/${this.account._id}`)
      .subscribe((chats: Chat[]) => {
        for (let i = 0; i < chats.length; i++) {
          this.numOfUnreadMessages += chats[i].newMessages;
        }
      });
    this.subscription?.add(sub);
  }

  getNoOfUnreadInboxes(): void {
    const sub = this.http
      .get<any>(
        API_URL + `/api/inboxes/getAllUnreadInboxes/${this.account._id}`
      )
      .subscribe((res: any) => {
        this.numOfUnreadInboxes = res.numOfUnread;
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
