import { Student } from './../../../../models/student';
import { API_URL } from './../../../../services/socketio.service';
import { Chat } from './../../../../models/chat';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Component, OnInit } from '@angular/core';

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
    private toast: NgToastService
  ) {
    this.getChats();
  }

  ngOnInit(): void {}

  async getChats() {
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
        this.http
          .get<Student[]>(API_URL + `/api/students/getOnlineUsers/${persons}`)
          .subscribe(
            (students: Student[]) =>
              (this.onlineUsers = students.filter(
                std => std.online === true
              ))
          );
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
}
