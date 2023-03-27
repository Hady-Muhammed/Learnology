import { map } from 'rxjs';
import { API_URL } from './../../../../app/services/socketio.service';
import { Teacher } from 'src/app/models/teacher';
import { Chat } from './../../../../app/models/chat';
import { FormControl } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-teacher-messages',
  templateUrl: './teacher-messages.component.html',
  styleUrls: ['./teacher-messages.component.css'],
})
export class TeacherMessagesComponent implements OnInit {
  account!: Teacher;
  chats!: Chat[];
  searchTerm = new FormControl('');
  filteredChats!: Chat[];

  constructor(
    private http: HttpClient,
    public router: Router,
    public toast: NgToastService
  ) {
    this.getAccount();
  }

  ngOnInit(): void {
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.getChats();
      });
  }

  filterData() {
    if (this.searchTerm.value) {
      this.filteredChats = this.chats.filter((chat: Chat) => {
        let person: any;
        if (chat.person1_ID === this.account._id) {
          person = chat.person2;
        } else {
          person = chat.person1;
        }
        return person.name.toLowerCase().includes(this.searchTerm.value);
      });
    } else {
      this.filteredChats = this.chats;
    }
  }

  goToConversation(id: string, chat: Chat) {
    chat.newMessages = 0;
    this.http.post(API_URL + '/api/chats/setNewMessages', {
      id,
      newMessages: 0,
    });
    this.router.navigateByUrl('teacher/t/messages/' + id);
  }

  getChats() {
    this.http
      .get<any[]>(API_URL + `/api/chats/getChats/${this.account._id}`)
      .pipe(
        map((chats) => {
          for (const chat of chats) {
            let personsArray = [
              ...chat.person1a,
              ...chat.person1b,
              ...chat.person2a,
              ...chat.person2b,
            ];
            chat.person1 = personsArray[0];
            chat.person2 = personsArray[1];
          }
          for (const chat of chats) {
            delete chat.person1a;
            delete chat.person1b;
            delete chat.person2a;
            delete chat.person2b;
          }
          return chats;
        })
      )
      .subscribe((chats: Chat[]) => {
        this.filteredChats = chats;
        this.chats = chats;
      });
  }

  deleteChat(id: string) {
    this.http
      .post(API_URL + '/api/chats/deleteChat', {
        id,
      })
      .subscribe({
        next: (res) => {
          this.toast.success({ detail: 'Chat deleted successfully!' });
          this.getChats();
          this.router.navigateByUrl('teacher/messages');
        },
        error: (res) => {
          this.toast.error({ detail: 'Something went wrong!' });
        },
      });
  }
}
