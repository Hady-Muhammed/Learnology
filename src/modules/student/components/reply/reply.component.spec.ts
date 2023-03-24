import { ReplyComponent } from './reply.component';
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

describe('ReplyComponent', () => {
  let component: ReplyComponent;
  let fixture: ComponentFixture<ReplyComponent>;
  let httpMock: HttpTestingController;
  let mockReply: reply;
  let mockStudent: Student;
  let mockReacts: react[];
  let mockComment: comment;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [ReplyComponent],
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
      replyHasWows: false,
    };
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
    fixture = TestBed.createComponent(ReplyComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    component.account = mockStudent;
    component.comment = mockComment;
    component.reply = mockReply;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteReply()', () => {
    it('should delete a reply of the specified id of reply and comment ', () => {
      spyOn(component.toast, 'success');
      spyOn(component.replyDeleted, 'emit');
      component.deleteReply(mockReply._id, mockComment._id);
      const req = httpMock.expectOne(API_URL + '/api/replies/deleteReply');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        replyID: mockReply._id,
        commentID: mockComment._id,
      });
      let mockRespone = { message: 'Success' };
      req.flush(mockRespone);
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.replyDeleted.emit).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.deleteReply(mockReply._id, mockComment._id);
      const req = httpMock.expectOne(API_URL + '/api/replies/deleteReply');
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('handleReactMenuOfReplyMouseOver()', () => {
    it('should show the reacts menu while the mouse pointer in hover on the button after 500 ms', fakeAsync(() => {
      component.handleReactMenuOfReplyMouseOver();
      expect(component.timeout).toBeTruthy();
      tick(500);
      expect(component.openReactMenuOfReply).toBeTruthy();
    }));
  });

  describe('handleReactMenuOfReplyMouseOut()', () => {
    it('should not show the reacts menu if the mouse pointer is out', () => {
      component.handleReactMenuOfReplyMouseOut();
      expect(component.timeout).toBeFalsy();
      expect(component.openReactMenuOfReply).toBeFalsy();
    });
  });

  describe('getAllReactsOfReply()', () => {
    it('should get all reacts of the reply', () => {
      component.getAllReactsOfReply(mockReply._id);
      component.reactsOnReply.subscribe();
      const req = httpMock.expectOne(
        API_URL + `/api/reacts/getAllReactsOfReply/${mockReply._id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockReacts);
      expect(component.opened).toBeTrue();
      expect(component.reactListOpened).toBeTrue();
    });
  });
});
