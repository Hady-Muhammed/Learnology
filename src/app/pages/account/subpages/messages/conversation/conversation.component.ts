import { API_URL } from './../../../../../services/socketio.service';
import { Teacher } from './../../../../../models/teacher';
import { Student } from './../../../../../models/student';
import { message, Chat } from './../../../../../models/chat';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
})
export class ConversationComponent implements OnInit {
  messages!: message[];
  account!: Student;
  person2!: Student | Teacher | any;
  id!: string;
  message!: string;
  newMessages!: number;
  typing!: boolean;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketioService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.socketService.joinChat(this.id);
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    this.getAccount(student.email);
  }

  ngOnInit(): void {
    this.listenForNewMessagesRealtime();
    this.listenForTyping();
  }
  getChat() {
    this.http
      .get<Chat>(API_URL + `/api/chats/getSingleChat/${this.id}`)
      .subscribe((chat: Chat) => {
        console.log(chat);
        this.messages = chat.messages;
        this.newMessages = chat.newMessages;
        if (chat.person1.email === this.account.email) {
          this.getPerson2(chat.person2.email);
        } else {
          this.getPerson2(chat.person1.email);
        }
        console.log(this.messages);
      });
  }

  getAccount(email: string) {
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.getChat();
      });
  }

  getPerson2(email: string) {
    // Person2 may be a student or a teacher so
    // we'll check first who's he/she
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${email}`)
      .subscribe((student: Student) => {
        if (!student) {
          this.http
            .get<Teacher>(API_URL + `/api/teachers/getTeacher/${email}`)
            .subscribe((teacher: Teacher) => {
              console.log('person2:', teacher);
              this.person2 = teacher;
            });
        } else {
          console.log('person2:', student);
          this.person2 = student;
        }
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
          this.socketService.typingMessage(this.id, '')
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

  listenForNewMessagesRealtime() {
    this.socketService.socket?.on('receive-message', (message: message) => {
      this.messages.push(message);
    });
  }

  listenForTyping() {
    this.socketService.socket?.on('listen-typing-message', (typing: any) => {
      console.log(typing);
      if (typing) this.typing = true;
      else this.typing = false;
    });
  }

  isTyping() {
    this.socketService.typingMessage(this.id, this.message);
  }
}
