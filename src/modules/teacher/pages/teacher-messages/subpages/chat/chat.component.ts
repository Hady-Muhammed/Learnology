import { map, Subscription } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';
import { API_URL } from './../../../../../../app/services/socketio.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { Student } from './../../../../../../app/models/student';
import { Teacher } from './../../../../../../app/models/teacher';
import { message, Chat } from './../../../../../../app/models/chat';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  messages!: message[];
  account!: Teacher;
  person2!: Student;
  id!: string;
  message: string = '';
  newMessages!: number;
  onlineUsers: any[] = [];
  typing!: boolean;
  chat!: Chat;
  isEmojiPickerVisible!: boolean;
  subscription!: Subscription;
  @ViewChild('lastMessage') lastMessage!: ElementRef;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public toast: NgToastService,
    public router: Router,
    public socketService: SocketioService
  ) {
    this.id = this.route.snapshot.params['id'];
    this.route.params.subscribe((val) => {
      this.id = this.route.snapshot.params['id'];
      const teacher: any = jwt_decode(localStorage.getItem('token') || '');
      this.getAccount(teacher.email);
    });
  }

  ngOnInit(): void {}

  getChat(): void {
    const sub = this.http
      .get<any>(API_URL + `/api/chats/getSingleChat/${this.id}`)
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
          return chats[0];
        })
      )
      .subscribe((chat: Chat) => {
        this.messages = chat.messages;
        this.newMessages = chat.newMessages;
        this.chat = chat;
        if (chat.person1_ID === this.account._id) {
          this.getPerson2(chat.person2_ID);
        } else {
          this.getPerson2(chat.person1_ID);
        }
        this.listenForNewMessagesRealtime();
        this.listenForTyping();
        setTimeout(() => {
          this.scrollToLastMessage();
        }, 100);
      });
    this.subscription?.add(sub);
  }

  getAccount(email: string): void {
    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${email}`)
      .subscribe((teacher: Teacher) => {
        this.account = teacher;
        this.socketService.joinChat(this.id);
        this.getChat();
      });
    this.subscription?.add(sub);
  }

  getPerson2(id: string): void {
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudentByID/${id}`)
      .subscribe((student: Student) => {
        this.person2 = student;
      });
    this.subscription?.add(sub);
  }

  sendMessage(): void {
    if (this.message) {
      let message = {
        belongsTo: this.account.email,
        content: this.message,
        sentAt: new Date().toUTCString(),
      };
      this.messages.push(message);
      this.scrollToLastMessage();
      this.socketService.sendMessage(message, this.id);
      const sub = this.http
        .post(API_URL + `/api/chats/sendMessage`, {
          id: this.id,
          message: {
            belongsTo: this.account.email,
            content: this.message,
            sentAt: new Date().toUTCString(),
          },
        })
        .subscribe((res: any) => {
          this.message = '';
          this.socketService.typingMessage(this.id, '');
          this.getChat();
        });
      this.http.post(API_URL + '/api/chats/setNewMessages', {
        id: this.id,
        newMessages: this.newMessages + 1,
      });
      this.subscription?.add(sub);
    }
  }

  scrollToLastMessage(): void {
    this.lastMessage?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  listenForNewMessagesRealtime(): void {
    this.socketService.socket?.on('receive-message', (message: message) => {
      this.messages.push(message);
      this.scrollToLastMessage();
    });
  }

  listenForTyping(): void {
    this.socketService.socket?.on('listen-typing-message', (typing: any) => {
      if (typing) this.typing = true;
      else this.typing = false;
    });
  }

  isTyping(): void {
    this.socketService.typingMessage(this.id, this.message);
  }

  deleteChat(id: string): void {
    const sub = this.http
      .post(API_URL + '/api/chats/deleteChat', {
        id,
      })
      .subscribe({
        next: (res) => {
          this.toast.success({ detail: 'Chat deleted successfully!' });
          this.router.navigateByUrl('teacher/messages');
        },
        error: (res) => {
          this.toast.error({ detail: 'Something went wrong!' });
        },
      });
    this.subscription?.add(sub);
  }

  addEmoji(event: any): void {
    this.message = `${this.message}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
