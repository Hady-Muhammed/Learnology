import { CommentComponent } from './comment.component';
import { SharedModule } from './../../../shared/shared.module';
import { Student } from './../../../../app/models/student';
import { comment, Post, react, reply } from './../../../../app/models/post';
import { API_URL } from './../../../../app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ElementRef } from '@angular/core';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let httpMock: HttpTestingController;
  let mockPost: Post;
  let mockStudent: Student;
  let mockReplies: reply[];
  let mockReacts: react[];
  let mockComment: comment;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [CommentComponent],
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
    mockReplies = [
      {
        _id: '',
        content: '',
        postID: '',
        commentID: '',
        replier: [],
        reacts: 0,
        repliedAt: '',
        replyHasLikes: false,
        replyHasLoves: false,
        replyHasWows: false,
      },
    ];
    mockReacts = [
      {
        type: '',
        owner: '',
        belongsTo: '',
        postID: '',
        reacter: [],
      },
    ];
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
    fixture = TestBed.createComponent(CommentComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    component.account = mockStudent;
    component.post = mockPost;
    component.comment = mockComment;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteComment()', () => {
    it('should delete a comment of the specified id of post and comment ', () => {
      spyOn(component.toast, 'success');
      spyOn(component.commentDeleted, 'emit');
      component.deleteComment(mockComment._id, mockPost._id);
      const req = httpMock.expectOne(API_URL + '/api/comments/deleteComment');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        postID: mockPost._id,
        commentID: mockComment._id,
      });
      let mockRespone = { message: 'Success' };
      req.flush(mockRespone);
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.commentDeleted.emit).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.deleteComment(mockComment._id, mockPost._id);
      const req = httpMock.expectOne(API_URL + '/api/comments/deleteComment');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('addReply()', () => {
    it('should add a reply for the specified comment on the specified post', () => {
      spyOn(component.toast, 'success');
      spyOn(component, 'getReplies');
      component.replyContent.setValue('mock');
      const input = document.createElement('input');
      component.addReply(mockPost, mockComment, input);
      const req = httpMock.expectOne(API_URL + '/api/replies/addReply');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        replyy: {
          postID: mockPost._id,
          commentID: mockComment._id,
          belongsTo: component.account._id, //
          content: component.replyContent.value,
          repliedAt: new Date().toUTCString(),
          reacts: 0,
          replyHasLikes: false,
          replyHasLoves: false,
          replyHasWows: false,
        },
        notificationn: {
          belongsTo: mockComment.belongsTo,
          sentBy: component.account._id,
          about_what: 'Replied to your comment',
          type: 'reply',
          happenedAt: new Date().toUTCString(),
          postID: mockPost._id,
        },
      });
      let mockRespone = { message: 'Success' };
      req.flush(mockRespone);
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getReplies).toHaveBeenCalled();
      expect(component.replyContent.value).toBe('');
    });

    it('should notify (real-time) the owner of the post that theres a new comment has been added', () => {
      component.account = {
      _id: '12345',
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
      reacts: [{postID: '123', belongsTo: "post",type: 'love'}],
      friends: [],
      pendingRequest: false,
      friendRequest: false,
      alreadyFriend: false
      }
      spyOn(component.toast,'success')
      spyOn(component.socketService,'notifyForANewReply')
      spyOn(component,'getReplies')
      component.replyContent.setValue("mock")
      const input = document.createElement('input')
      component.addReply(mockPost, mockComment, input);
      const req = httpMock.expectOne(API_URL + "/api/replies/addReply")
      expect(req.request.method).toBe("POST")
      let mockRespone = {message: "Success"}
      req.flush(mockRespone)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.socketService.notifyForANewReply).toHaveBeenCalled()
      expect(component.getReplies).toHaveBeenCalled()
      expect(component.replyContent.value).toBe("")
    });

    it('should reset the comment input after adding the comment', () => {
      spyOn(component,'getReplies')
      component.replyContent.setValue("mock")
      const input = document.createElement('input')
      component.addReply(mockPost, mockComment, input);
      const req = httpMock.expectOne(API_URL + "/api/replies/addReply")
      expect(req.request.method).toBe("POST")
      let mockRespone = {message: "Success"}
      req.flush(mockRespone)
      expect(component.getReplies).toHaveBeenCalled()
      expect(component.replyContent.value).toBe("")
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      component.replyContent.setValue("mock")
      const input = document.createElement('input')
      component.addReply(mockPost,mockComment,input)
      const req = httpMock.expectOne(API_URL + "/api/replies/addReply")
      expect(req.request.method).toBe("POST")
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('getReplies()', () => {
    it('should get replies of the specified comment', () => {
      component.getReplies(mockComment._id);
      const req = httpMock.expectOne(
        API_URL + `/api/replies/getReplies/${mockComment._id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockReplies);
      expect(component.replies).toBe(mockReplies);
    });
  });

  describe('openReplyField()', () => {
    it('should open the reply field and focus on it', fakeAsync(() => {
      const mockElementRef = {
        nativeElement: {
          focus: () => {
          }
        }
      };
      component.replyInp = mockElementRef as ElementRef;
      spyOn(component.replyInp.nativeElement,"focus")
      component.openReplyField()
      expect(component.showReplyInput).toBeTrue()
      tick(500)
      expect(component.replyInp.nativeElement.focus).toHaveBeenCalled()
    }));
  });

  describe('detectChanges()', () => {
    it('should emit event to the post component that react has happened', () => {
      spyOn(component.reactHappened,'emit')
      component.detectChanges()
      expect(component.reactHappened.emit).toHaveBeenCalled()
    });
  });

  describe('handleReactMenuOfCommentMouseOver()', () => {
    it('should show the reacts menu while the mouse pointer in hover on the button after 500 ms', fakeAsync(() => {
      component.handleReactMenuOfCommentMouseOver();
      expect(component.timeout).toBeTruthy();
      tick(500);
      expect(component.openReactMenuOfComment).toBeTruthy();
    }));
  });

  describe('handleReactMenuOfCommentMouseOut()', () => {
    it('should not show the reacts menu if the mouse pointer is out', () => {
      component.handleReactMenuOfCommentMouseOut();
      expect(component.timeout).toBeFalsy();
      expect(component.openReactMenuOfComment).toBeFalsy();
    });
  });

  describe('getAllReactsOfComment()', () => {
    it('should get all reacts of the comment', () => {
      component.getAllReactsOfComment(mockComment._id)
      component.reactsOnComment.subscribe()
      const req = httpMock.expectOne(API_URL + `/api/reacts/getAllReactsOfComment/${mockComment._id}`)
      expect(req.request.method).toBe("GET")
      req.flush(mockReacts)
      expect(component.opened).toBeTrue()
      expect(component.reactListOpened).toBeTrue()
    });
  });
});
