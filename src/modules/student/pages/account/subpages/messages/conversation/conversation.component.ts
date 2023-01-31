import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import { message, Chat } from 'src/app/models/chat';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';

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
  typing: boolean = false;
  @ViewChild('lastMessage') lastMessage!: ElementRef

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private socketService: SocketioService
  ) {
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    this.id = this.route.snapshot.params['id'];
    this.getAccount(student.email);
  }

  ngOnInit(): void {
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
        this.listenForNewMessagesRealtime();
        this.listenForTyping();
        setTimeout(() => {
          this.scrollToLastMessage()
        }, 100);
      });
  }

  getAccount(email: string) {
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.socketService.joinChat(this.id)
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
              this.person2 = teacher;
            });
        } else {
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
      this.scrollToLastMessage()
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
      this.scrollToLastMessage()
    });
  }

  scrollToLastMessage() {
    this.lastMessage?.nativeElement?.scrollIntoView({behavior: 'smooth', block: 'nearest' , inline: 'start'})
  }

  listenForTyping() {
    this.socketService.socket?.on('listen-typing-message', (typing: boolean) => {
      console.log(typing);
      if (typing) this.typing = true;
      else this.typing = false;
    });
  }

  isTyping() {
    this.socketService.typingMessage(this.id, this.message);
  }

}
