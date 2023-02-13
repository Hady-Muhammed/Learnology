import { API_URL, SocketioService } from 'src/app/services/socketio.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgToastService } from 'ng-angular-popup';
import { Post, comment, reply } from 'src/app/models/post';
import { Student } from 'src/app/models/student';

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
  @Output() openReactMenu = new EventEmitter<boolean>();
  @Output() reactHappened = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private toast: NgToastService,
    private socketService: SocketioService
  ) {}

  ngOnInit(): void {}

  reactOnPost(id: string, react: any, postOwner: Student) {
    this.openReactMenu.emit(false);
    this.http
      .post(API_URL + '/api/reacts/reactOnPost', {
        studentID: this.account._id,
        postID: id,
        react,
        notificationn: {
          belongsTo: postOwner._id,
          sentBy: this.account._id,
          about_what: 'Reacted to your post',
          type: react.type,
          happenedAt: new Date().toUTCString(),
          postID: id,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          if (postOwner._id !== this.account._id) {
            this.socketService.notifyForANewReact(postOwner.email);
          }
          this.reactHappened.emit(true);
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  reactOnComment(postID: string, react: any, comment: comment) {
    this.openReactMenu.emit(false);
    this.http
      .post(API_URL + '/api/reacts/reactOnComment', {
        studentID: this.account._id,
        postID,
        react,
        commentID: comment._id,
        notificationn: {
          belongsTo: comment.belongsTo,
          sentBy: this.account._id,
          about_what: 'Reacted to your comment',
          type: react.type,
          happenedAt: new Date().toUTCString(),
          postID,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          if (comment.commenter[0]._id !== this.account._id) {
            this.socketService.notifyForANewReact(comment.commenter[0].email);
          }
          this.reactHappened.emit(true);
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }

  reactOnReply(postID: string, react: any, reply: reply) {
    this.openReactMenu.emit(false);
    this.http
      .post(API_URL + '/api/reacts/reactOnReply', {
        studentID: this.account._id,
        postID,
        react,
        replyID: reply._id,
        notificationn: {
          belongsTo: reply.replier[0]._id,
          sentBy: this.account._id,
          about_what: 'Reacted to your reply',
          type: react.type,
          happenedAt: new Date().toUTCString(),
          postID,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          if (reply.replier[0]._id !== this.account._id) {
            this.socketService.notifyForANewReact(reply.replier[0].email);
          }
          this.reactHappened.emit(true);
        },
        error: (err) => {
          this.toast.error({ detail: err.message });
        },
      });
  }
}
