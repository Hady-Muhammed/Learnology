import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { API_URL } from 'src/app/services/socketio.service';
import { react, reply, comment, Post } from 'src/app/models/post';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css'],
})
export class ReplyComponent implements OnInit {
  timeout!: any;
  reactsOnReply!: Observable<react[]>;
  openReactMenuOfReply!: boolean;
  reactListOpened!: boolean;
  opened!: boolean;
  @Output() showReply = new EventEmitter();
  @Output() reactHappened = new EventEmitter();
  @Output() replyDeleted = new EventEmitter();
  @Input('reply') reply!: reply;
  @Input('comment') comment!: comment;
  @Input('post') post!: Post;
  @Input('account') account!: Student;

  constructor(private http: HttpClient, public toast: NgToastService) {}

  ngOnInit(): void {}

  handleReactMenuOfReplyMouseOver() {
    this.timeout = window.setTimeout(() => {
      this.openReactMenuOfReply = true;
    }, 500);
  }

  handleReactMenuOfReplyMouseOut() {
    window.clearTimeout(this.timeout);
    this.openReactMenuOfReply = false;
  }

  deleteReply(replyID: string, commentID: string) {
    this.http
      .post(API_URL + '/api/replies/deleteReply', { replyID, commentID })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.replyDeleted.emit(true);
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  getAllReactsOfReply(replyID: string) {
    this.reactListOpened = true;
    this.opened = true;
    this.reactsOnReply = this.http.get<react[]>(
      API_URL + `/api/reacts/getAllReactsOfReply/${replyID}`
    );
  }
}
