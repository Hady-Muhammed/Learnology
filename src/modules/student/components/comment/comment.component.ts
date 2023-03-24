import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { comment, Post, react, reply } from 'src/app/models/post';
import { Student } from 'src/app/models/student';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  replies!: reply[];
  timeout!: any;
  opened!: boolean;
  openReactMenuOfComment!: boolean;
  reactsOnComment!: Observable<react[]>;
  reactsOnReply!: Observable<react[]>;
  reactListOpened!: boolean;
  currentReactList!: string;
  replyContent = new FormControl('');
  showReplyInput!: boolean;
  @ViewChild('replyInp') replyInp!: ElementRef;

  @Input('post') post!: Post;
  @Input('comment') comment!: comment;
  @Input('account') account!: Student;
  @Output() reactHappened = new EventEmitter();
  @Output() commentDeleted = new EventEmitter();

  constructor(
    private http: HttpClient,
    public socketService: SocketioService,
    public toast: NgToastService
  ) {}

  ngOnInit(): void {}

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

  deleteComment(commentID: string, postID: string) {
    this.http
      .post(API_URL + '/api/comments/deleteComment', { commentID, postID })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.commentDeleted.emit(true);
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  addReply(post: Post, comment: comment, input: HTMLInputElement) {
    if (this.replyContent.value) {
      this.http
        .post(API_URL + '/api/replies/addReply', {
          replyy: {
            postID: post._id,
            commentID: comment._id,
            belongsTo: this.account._id, //
            content: this.replyContent.value,
            repliedAt: new Date().toUTCString(),
            reacts: 0,
            replyHasLikes: false,
            replyHasLoves: false,
            replyHasWows: false,
          },
          notificationn: {
            belongsTo: comment.belongsTo,
            sentBy: this.account._id,
            about_what: 'Replied to your comment',
            type: 'reply',
            happenedAt: new Date().toUTCString(),
            postID: post._id,
          },
        })
        .subscribe({
          next: (res: any) => {
            this.toast.success({ detail: res.message });
            this.replyContent.setValue('');
            if (comment.belongsTo !== this.account._id) {
              this.socketService.notifyForANewReply(comment.commenter[0].email);
            }
            this.getReplies(comment._id);
          },
          error: (err) => {
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
    this.reactHappened.emit(true);
  }
}
