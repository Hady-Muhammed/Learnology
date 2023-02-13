import { Chat } from 'src/app/models/chat';
import {
  API_URL,
  SocketioService,
} from './../../../../app/services/socketio.service';
import { Teacher } from './../../../../app/models/teacher';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-navbarr',
  templateUrl: './navbarr.component.html',
  styleUrls: ['./navbarr.component.css'],
})
export class NavbarrComponent implements OnInit {
  account!: Teacher;
  numOfUnreadMessages: number = 0;
  numOfUnreadInboxes!: number;
  @Input() toggle!: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    private socketService: SocketioService
  ) {
    this.getAccount();
  }

  ngOnInit(): void {}

  logOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signup');
    this.socketService.disconnect();
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.connectToSocket();
        this.getNoOfUnreadMessages();
        this.getNoOfUnreadInboxes();
      });
  }

  connectToSocket() {
    if (!this.isConnectedToSocket()) {
      this.socketService.setupSocketConnection(this.account.email);
      this.socketService.online(this.account._id);
    } else {
    }
  }

  isConnectedToSocket() {
    return this.socketService?.socket?.connected;
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
      .subscribe((res: any) => (this.numOfUnreadInboxes = res.numOfUnread));
  }
}
