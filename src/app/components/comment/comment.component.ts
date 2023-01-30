import { FormControl } from '@angular/forms';
import { Post, react, reply } from './../../models/post';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { comment } from 'src/app/models/post';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  replies!: reply[];
  timeout!: any
  opened!: boolean
  openReactMenuOfComment!: boolean;
  reactsOnComment!: Observable<react[]>;
  reactsOnReply!: Observable<react[]>;
  reactListOpened!: boolean;
  currentReactList!: string;
  replyContent = new FormControl('');
  showReplyInput!: boolean;
  @ViewChild('replyInp') replyInp!: ElementRef;

  @Input('post') post!: Post
  @Input('comment') comment!: comment
  @Input('account') account!: Student
  @Output() reactHappened = new EventEmitter()
  @Output() commentDeleted = new EventEmitter()
  constructor(
    private http: HttpClient,
    private toast: NgToastService,
  ) {
  }

  ngOnInit(): void {
  }

  handleReactMenuOfCommentMouseOver() {
    this.timeout = window.setTimeout(() => {
      this.openReactMenuOfComment = true;
    }, 500);
  }

  handleReactMenuOfCommentMouseOut() {
    window.clearTimeout(this.timeout);
    this.openReactMenuOfComment = false;
  }

  getAllReactsOfComment(commentID: string) {
    this.reactListOpened = true;
    this.opened = true;
    this.reactsOnComment = this.http.get<react[]>(
      API_URL + `/api/reacts/getAllReactsOfComment/${commentID}`
    );
  }

  deleteComment(
    commentID: string,
    postID: string,
  ) {
    this.http
      .post(API_URL + '/api/comments/deleteComment', { commentID, postID })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.toast.success({ detail: res.message });
          this.commentDeleted.emit(true)
        },
        error: (err) => {
          console.log(err);
          this.toast.error({ detail: err.message });
        },
      });
  }

  addReply(
    postID: string,
    commentID: string,
    input: HTMLInputElement
  ) {
    if (this.replyContent.value) {
      this.http
        .post(API_URL + '/api/replies/addReply', {
          replyy: {
            postID,
            commentID,
            belongsTo: this.account._id,
            content: this.replyContent.value,
            repliedAt: new Date().toUTCString(),
            reacts: 0,
            replyHasLikes: false,
            replyHasLoves: false,
            replyHasWows: false,
          },
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.toast.success({ detail: res.message });
            this.replyContent.setValue('');
            this.getReplies(commentID)
          },
          error: (err) => {
            console.log(err);
            this.toast.error({ detail: err.message });
          },
        });
    }
  }

  getReplies(commentID: string) {
      this.http
        .get<reply[]>(API_URL + `/api/replies/getReplies/${commentID}`)
        .subscribe((replies: reply[]) => {
          this.replies = replies;
        });
  }

  openReplyField() {
    this.showReplyInput = true;
    setTimeout(() => {
      this.replyInp.nativeElement.focus();
    }, 500);
  }

  detectChanges() {
    this.reactHappened.emit(true)
  }

  test(){
    console.log('changed')
  }
}