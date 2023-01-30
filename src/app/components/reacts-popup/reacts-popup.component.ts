import { API_URL } from 'src/app/services/socketio.service';
import { Student } from './../../models/student';
import { comment, Post, reply } from './../../models/post';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-reacts-popup',
  templateUrl: './reacts-popup.component.html',
  styleUrls: ['./reacts-popup.component.css'],
})

export class ReactsPopupComponent implements OnInit {
  @Input('type') type!: string;
  @Input('isOpened') isOpened!: boolean;
  @Input('post') post!: Post;
  @Input('comment') comment!: comment;
  @Input('reply') reply!: reply;
  @Input('account') account!: Student;
  @Output() openReactMenu = new EventEmitter<boolean>()
  @Output() reactHappened = new EventEmitter<boolean>()
  constructor(private http: HttpClient, private toast: NgToastService) {}

  reactOnPost(id: string, react: any) {
    this.openReactMenu.emit(false)
    this.http
      .post(API_URL + '/api/reacts/reactOnPost', {
        studentID: this.account._id,
        postID: id,
        react,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.reactHappened.emit(true)
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  reactOnComment(
    postID: string,
    react: any,
    commentID: string,
  ) {
    this.openReactMenu.emit(false)
    this.http
      .post(API_URL + '/api/reacts/reactOnComment', {
        studentID: this.account._id,
        postID,
        react,
        commentID,
      })
      .subscribe({
        next: (res: any) => {
          console.log('res: ', res);
          this.toast.success({ detail: res.message });
          this.reactHappened.emit(true)
        },
        error: (err) => {
          console.log('err: ', err);
          this.toast.error({ detail: err.message });
        },
      });
  }

  reactOnReply(
    postID: string,
    react: any,
    replyID: string,
  ) {
    this.openReactMenu.emit(false)
    this.http
      .post(API_URL + '/api/reacts/reactOnReply', {
        studentID: this.account._id,
        postID,
        react,
        replyID,
      })
      .subscribe({
        next: (res: any) => {
          console.log('res: ', res);
          this.toast.success({ detail: res.message });
          this.reactHappened.emit(true)
        },
        error: (err) => {
          console.log('err: ', err);
          this.toast.error({ detail: err.message });
        },
      });
  }

  ngOnInit(): void {}
}
