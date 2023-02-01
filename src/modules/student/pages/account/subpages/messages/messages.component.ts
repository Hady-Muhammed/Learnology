import { Teacher } from './../../../../../../app/models/teacher';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/models/chat';
import { Student } from 'src/app/models/student';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {

  account!: string;
  chats!: Chat[];
  onlineUsers!: Student[];
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService,
  ) {
    this.getChats();
  }

  ngOnInit(): void {
    this.getAccount();
  }

  getChats() {
    const token: any = localStorage.getItem('token');
    const student: any = jwt_decode(token);
    this.account = student.email;
    this.http
      .post<Chat[]>(API_URL + '/api/chats/getChats', {
        email: student.email,
      })
      .subscribe((chats: Chat[]) => {
        this.chats = chats;
        let persons = [];
        for (let i = 0; i < chats.length; i++) {
          if (chats[i].person1.email !== student.email) {
            persons.push(chats[i].person1.email);
          } else if (chats[i].person2.email !== student.email) {
            persons.push(chats[i].person2.email);
          }
        }
        console.log(persons);
        this.getOnlineUsers(persons)
      });
  }

  goToConversation(id: string) {
    this.http
      .post(API_URL + '/api/chats/setNewMessages', {
        id,
        newMessages: 0,
      })
      .subscribe((res: any) => console.log(res));
    this.router.navigateByUrl('account/messages/' + id);
  }

  deleteChat(id: string) {
    this.http
      .post(API_URL + '/api/chats/deleteChat', {
        id,
      })
      .subscribe((res: any) => {
        console.log(res);
        this.getChats();
        this.toast.success({ detail: 'Conversation deleted!' });
      });
  }

  isOnline(email: string){
    return this.onlineUsers?.find(user => user.email === email && user.online === true)
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student.email
      });
  }

  getOnlineUsers(persons: string[]) {
    this.http
          .get<Student[]>(API_URL + `/api/students/getOnlineUsers/${persons}`)
          .subscribe(
            (onlineUsers: any[]) =>
              {this.onlineUsers = onlineUsers
                console.log(onlineUsers)
              }
      );
  }
}
