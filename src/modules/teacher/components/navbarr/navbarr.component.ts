import { Chat } from 'src/app/models/chat';
import {
  API_URL,
  SocketioService,
} from './../../../../app/services/socketio.service';
import { Teacher } from './../../../../app/models/teacher';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbarr',
  templateUrl: './navbarr.component.html',
  styleUrls: ['./navbarr.component.css'],
})
export class NavbarrComponent implements OnInit, OnDestroy {
  account!: Teacher;
  numOfUnreadMessages: number = 0;
  numOfUnreadInboxes!: number;
  subscription!: Subscription;

  @Input() toggle!: boolean;

  constructor(
    public router: Router,
    private http: HttpClient,
    public socketService: SocketioService
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
    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.connectToSocket();
        this.getNoOfUnreadMessages();
        this.getNoOfUnreadInboxes();
      });
    this.subscription?.add(sub);
  }

  connectToSocket() {
    if (!this.isConnectedToSocket()) {
      this.socketService.setupSocketConnection(this.account.email);
      this.socketService.online(this.account._id);
    }
  }

  isConnectedToSocket() {
    return this.socketService?.socket?.connected;
  }

  getNoOfUnreadMessages() {
    const sub = this.http
      .get<Chat[]>(API_URL + `/api/chats/getChats/${this.account._id}`)
      .subscribe((chats: Chat[]) => {
        for (let i = 0; i < chats.length; i++) {
          this.numOfUnreadMessages += chats[i].newMessages;
        }
      });
    this.subscription?.add(sub);
  }

  getNoOfUnreadInboxes() {
    const sub = this.http
      .get<any>(
        API_URL + `/api/inboxes/getAllUnreadInboxes/${this.account._id}`
      )
      .subscribe((res: any) => (this.numOfUnreadInboxes = res.numOfUnread));
    this.subscription?.add(sub);
  }
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
