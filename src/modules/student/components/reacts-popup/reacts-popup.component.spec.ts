import { reply } from './../../../../app/models/post';
import { Student } from './../../../../app/models/student';
import { API_URL } from './../../../../app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactsPopupComponent } from './reacts-popup.component';
import { comment, Post, react } from 'src/app/models/post';

describe('ReactsPopupComponent', () => {
  let component: ReactsPopupComponent;
  let fixture: ComponentFixture<ReactsPopupComponent>;
  let httpMock: HttpTestingController;
  let mockComment: comment;
  let mockPost: Post;
  let mockStudent: Student;
  let mockReact: react;
  let mockReply: reply;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ReactsPopupComponent],
    }).compileComponents();
    mockStudent = {
      _id: '',
      email: '',
      name: '',
      picture: 'img-url',
      password: '',
      createdAt: '',
      enrolled_courses: [],
      liked_teachers: [],
      taken_quizzes: [],
      online: false,
      last_activity: '',
      reacts: [{ postID: '123', belongsTo: 'post', type: 'love' }],
      friends: [],
      pendingRequest: false,
      friendRequest: false,
      alreadyFriend: false,
    };
    mockPost = {
      _id: '123',
      authorID: '',
      author: [mockStudent],
      image: '',
      publishedAt: '',
      content: '',
      comments: 0,
      reacts: 0,
      postHasLikes: false,
      postHasLoves: false,
      postHasWows: false,
    };
    mockComment = {
      _id: '',
      belongsTo: '',
      commenter: [mockStudent],
      content: '',
      replies: 0,
      commentedAt: '',
      reacts: 0,
      commentHasLikes: false,
      commentHasLoves: false,
      commentHasWows: false,
    };
    mockReact = {
      type: '',
      owner: '',
      belongsTo: '',
      postID: '',
      reacter: [],
    },
    mockReply = {
      _id: '',
      content: '',
      postID: '',
      commentID: '',
      replier: [mockStudent],
      reacts: 0,
      repliedAt: '',
      replyHasLikes: false,
      replyHasLoves: false,
      replyHasWows: false
    }
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ReactsPopupComponent);
    component = fixture.componentInstance;
    component.post = mockPost
    component.comment = mockComment
    component.account = mockStudent
    fixture.detectChanges();
  });
  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reactOnPost()', () => {
    it('should react on the specified post', () => {
      spyOn(component.reactHappened, 'emit');
      spyOn(component.toast, 'success');
      component.reactOnPost(mockPost._id, mockReact, mockStudent);
      const req = httpMock.expectOne(API_URL + '/api/reacts/reactOnPost');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        studentID: component.account._id,
        postID: mockPost._id,
        react: mockReact,
        notificationn: {
          belongsTo: mockStudent._id,
          sentBy: component.account._id,
          about_what: 'Reacted to your post',
          type: mockReact.type,
          happenedAt: new Date().toUTCString(),
          postID: mockPost._id,
        },
      });
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.reactHappened.emit).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.reactOnPost(mockPost._id, mockReact, mockStudent);
      const req = httpMock.expectOne(API_URL + '/api/reacts/reactOnPost');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('reactOnComment()', () => {
    it('should react on the specified comment', () => {
      spyOn(component.reactHappened, 'emit');
      spyOn(component.toast, 'success');
      component.reactOnComment(mockPost._id, mockReact, mockComment);
      const req = httpMock.expectOne(API_URL + '/api/reacts/reactOnComment');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        studentID: component.account._id,
        postID: mockPost._id,
        react: mockReact,
        commentID: mockComment._id,
        notificationn: {
          belongsTo: mockComment._id,
          sentBy: component.account._id,
          about_what: 'Reacted to your comment',
          type: mockReact.type,
          happenedAt: new Date().toUTCString(),
          postID: mockPost._id,
        },
      });
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.reactHappened.emit).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.reactOnComment(mockPost._id, mockReact, mockComment);
      const req = httpMock.expectOne(API_URL + '/api/reacts/reactOnComment');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('reactOnReply()', () => {
    it('should react on the specified reply', () => {
      spyOn(component.reactHappened, 'emit');
      spyOn(component.toast, 'success');
      component.reactOnReply(mockPost._id, mockReact, mockReply);
      const req = httpMock.expectOne(API_URL + '/api/reacts/reactOnReply');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        studentID: component.account._id,
        postID: mockPost._id,
        react: mockReact,
        replyID: mockReply._id,
        notificationn: {
          belongsTo: mockReply.replier[0]._id,
          sentBy: component.account._id,
          about_what: 'Reacted to your reply',
          type: mockReact.type,
          happenedAt: new Date().toUTCString(),
          postID: mockPost._id,
        },
      });
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.reactHappened.emit).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.reactOnReply(mockPost._id, mockReact, mockReply);
      const req = httpMock.expectOne(API_URL + '/api/reacts/reactOnReply');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
