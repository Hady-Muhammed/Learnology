import { map, Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import { message } from 'src/app/models/chat';
import { Student } from 'src/app/models/student';
import { Teacher } from 'src/app/models/teacher';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
})
export class ConversationComponent implements OnInit , OnDestroy {
  messages!: message[];
  account!: Student;
  person2!: Student | Teacher | any;
  id!: string;
  message: string = '';
  newMessages!: number;
  typing: boolean = false;
  isEmojiPickerVisible!: boolean;
  subscription!: Subscription;

  @ViewChild('lastMessage') lastMessage!: ElementRef;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public socketService: SocketioService
  ) {
    const student: any = jwt_decode(localStorage.getItem('token') || '');
    this.id = this.route.snapshot.params['id'];
    this.getAccount(student.email);
  }

  ngOnInit(): void {}

  getAccount(email: string): void {
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudent/${email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.socketService.joinChat(this.id);
        this.getChat();
      });
    this.subscription?.add(sub);
  }

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
      .subscribe((chat: any) => {
        this.messages = chat.messages;
        this.newMessages = chat.newMessages;
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

  getPerson2(id: string): void {
    // Person2 may be a student or a teacher so
    // we'll check first who's he/she
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudentByID/${id}`)
      .subscribe((student: Student) => {
        if (!student) {
          this.http
            .get<Teacher>(API_URL + `/api/teachers/getTeacherByID/${id}`)
            .subscribe((teacher: Teacher) => {
              this.person2 = teacher;
            });
        } else {
          this.person2 = student;
        }
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
        });
      this.subscription?.add(sub);
      this.http.post(API_URL + '/api/chats/setNewMessages', {
        id: this.id,
        newMessages: this.newMessages + 1,
      });
    }
  }

  listenForNewMessagesRealtime(): void {
    this.socketService.socket?.on('receive-message', (message: message) => {
      this.messages.push(message);
      this.scrollToLastMessage();
    });
  }

  scrollToLastMessage(): void {
    this.lastMessage?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  }

  listenForTyping(): void {
    this.socketService.socket?.on(
      'listen-typing-message',
      (typing: boolean) => {
        if (typing) this.typing = true;
        else this.typing = false;
      }
    );
  }

  isTyping(): void {
    this.socketService.typingMessage(this.id, this.message);
  }

  addEmoji(event: any): void {
    this.message = `${this.message}${event.emoji.native}`;
    this.isEmojiPickerVisible = false;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
