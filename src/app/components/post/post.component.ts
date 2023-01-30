import { Student } from './../../models/student';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Observable } from 'rxjs';
import { Post, comment, react } from 'src/app/models/post';
import { API_URL } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  reactsOnPost!: Observable<react[]>;
  reactListOpened!: boolean;
  commentContent = new FormControl('');
  openReplies: boolean = false;
  opened!: boolean;
  timeout!: any;
  closeTimeout!: any;
  openReactMenuOfPost!: boolean;
  seeMore!: boolean;
  loading: boolean = false;
  comments!: comment[];
  currentReactList!: string;
  @Input('post') post!: Post;
  @Input('account') account!: Student;
  @Output() reactHappened = new EventEmitter<boolean>();
  @ViewChild('inp') inp!: ElementRef;

  constructor(private http: HttpClient, private toast: NgToastService) {}

  ngOnInit(): void {
    console.log(this.post)
  }

  addComment(postID: string, input: HTMLInputElement) {
    if (this.commentContent.value) {
      this.http
        .post(API_URL + '/api/comments/addComment', {
          commentt: {
            postID,
            belongsTo: this.account._id,
            content: this.commentContent.value,
            replies: 0,
            commentedAt: new Date().toUTCString(),
            reacts: 0,
            commentHasLikes: false,
            commentHasLoves: false,
            commentHasWows: false,
          },
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.toast.success({ detail: res.message });
            this.commentContent.setValue('');
            this.getComments(postID, input, false);
          },
          error: (err) => {
            console.log(err);
            this.toast.error({ detail: err.message });
          },
        });
    }
  }

  checkReactType(post: Post) {
    let reactFound = this.account?.reacts.find(
      (react) => react.postID === post._id && react.belongsTo === 'post'
    );
    return reactFound?.type;
  }

  getComments(postID: string, input: HTMLInputElement, loadingFlag: boolean) {
    if (loadingFlag) {
      input.focus();
      window.scrollTo(window.scrollX, input.offsetTop - 400);
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    }
    this.http
      .get<comment[]>(API_URL + `/api/comments/getComments/${postID}`)
      .subscribe((comments: comment[]) => {
        this.comments = comments;
        console.log(comments);
      });
  }

  minimizeContent(content: string) {
    console.log(this.seeMore);
    return this.seeMore ? content : content.slice(0, 400);
  }

  getAllReactsOfPost(postID: string) {
    this.currentReactList = 'post';
    this.reactListOpened = true;
    this.opened = true;
    this.reactsOnPost = this.http.get<react[]>(
      API_URL + `/api/reacts/getAllReactsOfPost/${postID}`
    );
  }

  handleReactMenuOfPostMouseOver() {
    this.timeout = window.setTimeout(() => {
      this.openReactMenuOfPost = true;
    }, 500);
  }

  handleReactMenuOfPostMouseOut() {
    window.clearTimeout(this.timeout);
    this.openReactMenuOfPost = false;
  }

  deletePost(id: string) {
    this.http
      .post(API_URL + '/api/posts/deletePost', { postID: id })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.toast.success({ detail: res.message });
        },
        error: (err) => {
          console.log(err);
          this.toast.error({ detail: err.message });
        },
      });
  }

  trackComments(index: any, comment: comment) {
    return comment._id;
  }
}
