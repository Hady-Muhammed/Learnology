import { SharedModule } from './../../../shared/shared.module';
import { Student } from './../../../../app/models/student';
import { comment, Post, react } from './../../../../app/models/post';
import { API_URL } from './../../../../app/services/socketio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { PostComponent } from './post.component';

describe('PostComponent', () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let httpMock: HttpTestingController
  let mockPost: Post
  let mockStudent: Student
  let mockComments: comment[]
  let mockReacts: react[]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,SharedModule],
      declarations: [ PostComponent ]
    })
    .compileComponents();
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
      reacts: [{postID: '123', belongsTo: "post",type: 'love'}],
      friends: [],
      pendingRequest: false,
      friendRequest: false,
      alreadyFriend: false
    }
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
      postHasWows: false
    }
    mockComments = [{
      _id: '',
      belongsTo: '',
      commenter: undefined,
      content: '',
      replies: 0,
      commentedAt: '',
      reacts: 0,
      commentHasLikes: false,
      commentHasLoves: false,
      commentHasWows: false
    }]
    mockReacts = [{
      type: '',
      owner: '',
      belongsTo: '',
      postID: '',
      reacter: []
    }]
    fixture = TestBed.createComponent(PostComponent);
    httpMock = TestBed.inject(HttpTestingController)
    component = fixture.componentInstance;
    component.account = mockStudent
    component.post = mockPost
    fixture.detectChanges()
  });

  afterEach(() => {
    httpMock.verify()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addComment()', () => {
    it('should add a comment to the post if there\'s a content in the input ', () => {
      spyOn(component.toast,'success')
      spyOn(component,'getComments')
      component.commentContent.setValue("mock")
      const input = document.createElement('input')
      component.addComment(mockPost,input)
      const req = httpMock.expectOne(API_URL + "/api/comments/addComment")
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual({
        commentt: {
            postID: mockPost._id,
            belongsTo: component.account._id,
            content: component.commentContent.value,
            replies: 0,
            commentedAt: new Date().toUTCString(),
            reacts: 0,
            commentHasLikes: false,
            commentHasLoves: false,
            commentHasWows: false,
          },
          notificationn: {
            belongsTo: mockPost.author[0]._id,
            sentBy: component.account._id,
            about_what: 'Commented on your post',
            type: 'comment',
            happenedAt: new Date().toUTCString(),
            postID: mockPost._id,
          },
      })
      let mockRespone = {message: "Success"}
      req.flush(mockRespone)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getComments).toHaveBeenCalled()
      expect(component.commentContent.value).toBe("")
    });

    it('should notify (real-time) the owner of the post that theres a new comment has been added', () => {
      component.account = {
      _id: '234',
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
      spyOn(component.socketService,'notifyForANewComment')
      spyOn(component,'getComments')
      component.commentContent.setValue("mock")
      const input = document.createElement('input')
      component.addComment(mockPost,input)
      const req = httpMock.expectOne(API_URL + "/api/comments/addComment")
      expect(req.request.method).toBe("POST")
      let mockRespone = {message: "Success"}
      req.flush(mockRespone)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.socketService.notifyForANewComment).toHaveBeenCalled()
      expect(component.getComments).toHaveBeenCalled()
      expect(component.commentContent.value).toBe("")
    });

    it('should reset the comment input after adding the comment', () => {
      spyOn(component,'getComments')
      component.commentContent.setValue("mock")
      const input = document.createElement('input')
      component.addComment(mockPost,input)
      const req = httpMock.expectOne(API_URL + "/api/comments/addComment")
      expect(req.request.method).toBe("POST")
      let mockRespone = {message: "Success"}
      req.flush(mockRespone)
      expect(component.getComments).toHaveBeenCalled()
      expect(component.commentContent.value).toBe("")
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      component.commentContent.setValue("mock")
      const input = document.createElement('input')
      component.addComment(mockPost,input)
      const req = httpMock.expectOne(API_URL + "/api/comments/addComment")
      expect(req.request.method).toBe("POST")
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('checkReactType()', () => {
    it('should check the react type if the user reacted before on the post', () => {
      expect(component.checkReactType(mockPost)).toBe("love");
    });
  });

  describe('getComments()', () => {
    it('should get comments of the specified post', fakeAsync(() => {
      const input = document.createElement("input")
      spyOn(input,'focus')
      component.getComments(mockPost._id,input,true)
      const req = httpMock.expectOne(API_URL + `/api/comments/getComments/${mockPost._id}`)
      expect(req.request.method).toBe("GET")
      req.flush(mockComments)
      expect(input.focus).toHaveBeenCalled()
      expect(component.comments).toBe(mockComments)
      expect(component.loading).toBeTrue()
      tick(500)
      expect(component.loading).toBeFalse()
    }));
  });

  describe('minimizeContent()', () => {
    it('should minimize the content according to the state of seeMore property if the string is more than 400 chars', () => {
      component.seeMore = false
      const stringMoreThan400Chars = 'a'.repeat(500)
      expect(component.minimizeContent(stringMoreThan400Chars)).toBe(stringMoreThan400Chars.slice(0,400));
    });
    it('should not minimize the content according to the state of seeMore property if the string is less than 400 chars', () => {
      component.seeMore = true
      const stringMoreThan400Chars = 'a'.repeat(500)
      expect(component.minimizeContent(stringMoreThan400Chars)).toBe(stringMoreThan400Chars);
    });
  });

  describe('getAllReactsOfPost()', () => {
    it('should get all reacts of the post', () => {
      component.getAllReactsOfPost(mockPost._id)
      component.reactsOnPost.subscribe()
      const req = httpMock.expectOne(API_URL + `/api/reacts/getAllReactsOfPost/${mockPost._id}`)
      expect(req.request.method).toBe("GET")
      req.flush(mockReacts)
      expect(component.opened).toBeTrue()
      expect(component.reactListOpened).toBeTrue()
      expect(component.currentReactList).toEqual('post')
    });
  });

  describe('handleReactMenuOfPostMouseOver()', () => {
    it('should show the reacts menu while the mouse pointer in hover on the button after 500 ms', fakeAsync(() => {
      component.handleReactMenuOfPostMouseOver()
      expect(component.timeout).toBeTruthy()
      tick(500)
      expect(component.openReactMenuOfPost).toBeTruthy()
    }));
  });

  describe('handleReactMenuOfPostMouseOut()', () => {
    it('should not show the reacts menu if the mouse pointer is out', () => {
      component.handleReactMenuOfPostMouseOut()
      expect(component.timeout).toBeFalsy()
      expect(component.openReactMenuOfPost).toBeFalsy()
    });
  });

  describe('deletePost()', () => {
    it('should delete the post of a specified id', () => {
      spyOn(component.toast,'success')
      component.deletePost(mockPost._id)
      const req = httpMock.expectOne(API_URL + `/api/posts/deletePost`)
      expect(req.request.body).toEqual({
        postID: mockPost._id
      })
      expect(req.request.method).toBe("POST")
      let mockResponse = {message: "Success"}
      req.flush(mockResponse)
      expect(component.toast.success).toHaveBeenCalled()
    });
    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      component.deletePost(mockPost._id)
      const req = httpMock.expectOne(API_URL + `/api/posts/deletePost`)
      expect(req.request.body).toEqual({
        postID: mockPost._id
      })
      expect(req.request.method).toBe("POST")
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('trackComments()', () => {
    it('should track the comments in the dom and render/compare for the new ones only', () => {
      expect(component.trackComments(5,mockComments[0])).toBe(mockComments[0]._id);
    });
  });

});
