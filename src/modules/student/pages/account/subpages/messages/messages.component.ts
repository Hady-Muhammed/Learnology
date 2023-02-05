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
import { map } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {

  account!: Student;
  chats!: any[];
  onlineUsers!: Student[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService,
  ) {
  }

  ngOnInit(): void {
    this.getAccount();
  }

  getChats() {
    this.http
      .get<any[]>(API_URL + `/api/chats/getChats/${this.account._id}`)
      .pipe(map((chats) => {
        for (const chat of chats) {
          let personsArray = [...chat.person1a,...chat.person1b,...chat.person2a,...chat.person2b]
          chat.person1 = personsArray[0]
          chat.person2 = personsArray[1]
        }
        for (const chat of chats) {
          delete chat.person1a
          delete chat.person1b
          delete chat.person2a
          delete chat.person2b
        }
        return chats
      }))
      .subscribe((chats: Chat[]) => {
        this.chats = chats
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

  getAccount() {
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${student.email}`)
      .subscribe((student: Student) => {
        this.account = student
        this.getChats()
      });
  }
}


