import { NgToastService } from 'ng-angular-popup';
import { API_URL } from './../../../../../../app/services/socketio.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { Student } from './../../../../../../app/models/student';
import { Teacher } from './../../../../../../app/models/teacher';
import { message, Chat } from './../../../../../../app/models/chat';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages!: message[];
  account!: Teacher;
  person2!: Student;
  id!: string;
  message!: string;
  newMessages!: number;
  onlineUsers: any[] = [];
  typing!: boolean;
  chat!: Chat;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toast: NgToastService,
    private router: Router,
    private socketService: SocketioService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.route.params.subscribe((val) => {
      this.id = this.route.snapshot.params['id'];
      const teacher: any = jwt_decode(localStorage.getItem('token') || '');
      this.getAccount(teacher.email);
    });
  }

  ngOnInit(): void {
  }

  getChat() {
    this.http
      .get<Chat>(API_URL + `/api/chats/getSingleChat/${this.id}`)
      .subscribe((chat: Chat) => {
        this.messages = chat.messages;
        this.newMessages = chat.newMessages;
        this.chat = chat;
        if (chat.person1.email === this.account.email) {
          this.getPerson2(chat.person2.email);
        } else {
          this.getPerson2(chat.person1.email);
        }
        this.listenForNewMessagesRealtime();
        this.listenForTyping();
        console.log(this.messages);
      });
  }

  getAccount(email: string) {
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.socketService.joinChat(this.id);
        this.getOnlineUsers();
        this.getChat();
      });
  }

  getPerson2(email: string) {
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${email}`)
      .subscribe((student: Student) => {
        this.person2 = student;
      });
  }

  sendMessage() {
    if (this.message) {
      let message = {
        belongsTo: this.account.email,
        content: this.message,
        sentAt: new Date().toUTCString(),
      };
      this.messages.push(message);
      this.socketService.sendMessage(message, this.id);
      this.http
        .post(API_URL + `/api/chats/sendMessage`, {
          id: this.id,
          message: {
            belongsTo: this.account.email,
            content: this.message,
            sentAt: new Date().toUTCString(),
          },
        })
        .subscribe((res: any) => {
          console.log('sendMessage res:', res);
          this.message = '';
          this.getChat();
        });
      this.http
        .post(API_URL + '/api/chats/setNewMessages', {
          id: this.id,
          newMessages: this.newMessages + 1,
        })
        .subscribe((res: any) => console.log(res));
    }
  }

  getOnlineUsers() {
    this.http
      .get<Student[]>(API_URL + '/api/students/getActiveStudents')
      .subscribe((students: Student[]) => {
        for (let i = 0; i < students.length; i++) {
          this.onlineUsers.push(students[i].email);
        }
        console.log(this.onlineUsers);
      });
  }

  listenForNewMessagesRealtime() {
    this.socketService.socket.on('receive-message', (message: message) => {
      this.messages.push(message);
    });
  }

  listenForTyping(){
    this.socketService.socket.on('listen-typing-message', (typing: any) => {
      if(typing)
        this.typing = true
      else
        this.typing = false
    });
  }

  isTyping(){
    this.socketService.typingMessage(this.id , this.message)
  }

  deleteChat(id:string){
    this.http.post(API_URL + '/api/chats/deleteChat', {
      id
    }).subscribe({
      next: res => {
      this.toast.success({detail: 'Chat deleted successfully!'})
      this.router.navigateByUrl('teacher/messages')
      },
      error: res => {
      this.toast.error({detail: 'Something went wrong!'})
      }
  })
  }
}
