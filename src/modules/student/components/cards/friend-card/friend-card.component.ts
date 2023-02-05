import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { Student } from 'src/app/models/student';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-friend-card',
  templateUrl: './friend-card.component.html',
  styleUrls: ['./friend-card.component.css'],
})
export class FriendCardComponent implements OnInit {

  @Input('friend') friend!: Student;
  @Input('account') account!: Student;
  @Output() friendRemoved = new EventEmitter()
  constructor(
    private http: HttpClient,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  removeFriend() {
    this.http
      .post(API_URL + '/api/students/removeFriend', {
        person1: this.friend,
        person2: this.account,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.friendRemoved.emit(true)
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  messageFriend() {
    this.http
      .post(API_URL + '/api/chats/createChat', {
        chat: {
          person1_ID: this.account._id,
          person2_ID: this.friend._id,
          newMessages: 0,
          messages: [],
        },
      })
      .subscribe((res: any) => {
        if (res.message === 'Chat already exists') {
          console.log(res);
          this.router.navigateByUrl(`/account/messages/${res.id}`);
        } else {
          console.log(res);
          this.router.navigateByUrl(`/account/messages/${res.id}`);
        }
      });
  }
}
