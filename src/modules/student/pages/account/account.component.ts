import { Chat } from 'src/app/models/chat';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  account!: Student;
  numOfUnreadRequests!: number;
  numOfUnreadMessages: number = 0;
  numOfUnreadInboxes!: number;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAccount();
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.getNoOfUnreadFriendRequests();
        this.getNoOfUnreadMessages();
        this.getNoOfUnreadInboxes();
      });
  }

  getNoOfUnreadFriendRequests() {
    this.http
      .get<any>(
        API_URL +
          `/api/frequests/getNoOfUnreadFriendRequests/${this.account._id}`
      )
      .subscribe((res: any) => {
        this.numOfUnreadRequests = res.numOfRequests;
      });
  }

  getNoOfUnreadMessages() {
    this.http
      .get<Chat[]>(API_URL + `/api/chats/getChats/${this.account._id}`)
      .subscribe((chats: Chat[]) => {
        for (let i = 0; i < chats.length; i++) {
          this.numOfUnreadMessages += chats[i].newMessages;
        }
      });
  }

  getNoOfUnreadInboxes() {
    this.http
      .get<any>(
        API_URL + `/api/inboxes/getAllUnreadInboxes/${this.account._id}`
      )
      .subscribe((res: any) => {
        this.numOfUnreadInboxes = res.numOfUnread;
      });
  }
}
