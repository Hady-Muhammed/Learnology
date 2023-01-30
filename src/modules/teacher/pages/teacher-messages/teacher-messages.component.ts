import { API_URL } from './../../../../app/services/socketio.service';
import { Student } from './../../../../app/models/student';
import { Teacher } from 'src/app/models/teacher';
import { SocketioService } from 'src/app/services/socketio.service';
import { Chat } from './../../../../app/models/chat';
import { FormControl } from '@angular/forms';
import jwt_decode from 'jwt-decode';
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
  teacher!: Teacher;
  account!: string;
  chats!: Chat[];
  searchTerm = new FormControl('');
  filteredChats!: Chat[];
  onlineUsers: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: NgToastService,
    private socketService: SocketioService
  ) {
    this.getChats();
  }
  ngOnInit(): void {
    this.getAccount()
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.socketService.setupSocketConnection(student.email);
  }

  getAccount() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => {
        this.teacher = teacher;
        // this.socketService.setupSocketConnection(teacher.email)
      });
  }

  filterData() {
    if (this.searchTerm.value) {
      this.filteredChats = this.chats.filter((chat: Chat) => {
        let person: any;
        if (chat.person1.email === this.account) {
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

  goToConversation(id: string) {
    this.http
      .post(API_URL + '/api/chats/setNewMessages', {
        id,
        newMessages: 0,
      })
      .subscribe((res: any) => console.log(res));
    this.router.navigateByUrl('teacher/t/messages/' + id);
  }

  getChats() {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwt_decode(token);
    this.account = teacher.email;
    this.http
      .post<Chat[]>(API_URL + '/api/chats/getChats', {
        email: teacher.email,
      })
      .subscribe((chats: Chat[]) => {
        this.filteredChats = chats;
        this.chats = chats;
        this.getOnlineUsers()
      });
  }

  deleteChat(id:string){
    this.http.post(API_URL + '/api/chats/deleteChat', {
      id
    }).subscribe({
      next: res => {
      this.toast.success({detail: 'Chat deleted successfully!'})
      this.getChats()
      this.router.navigateByUrl('teacher/messages')
      },
      error: res => {
      this.toast.error({detail: 'Something went wrong!'})
      }
  })
  }

  getOnlineUsers(){
    this.http.get<Student[]>(API_URL + '/api/students/getActiveStudents')
    .subscribe((students: Student[]) => {
      for (let i = 0; i < students.length; i++) {
        this.onlineUsers.push(students[i].email)
      }
    })
  }

}
