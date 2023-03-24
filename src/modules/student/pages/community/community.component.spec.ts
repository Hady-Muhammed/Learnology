import { Post } from 'src/app/models/post';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CommunityComponent } from './community.component';

describe('CommunityComponent', () => {
  let component: CommunityComponent;
  let fixture: ComponentFixture<CommunityComponent>;
  let httpMock: HttpTestingController;
  let mockStudent: Student = {
    _id: '',
    email: 'test@example.com',
    name: '',
    picture: '',
    password: '',
    createdAt: '',
    enrolled_courses: [],
    liked_teachers: [],
    taken_quizzes: [],
    online: false,
    last_activity: '',
    reacts: [],
    friends: [],
    pendingRequest: false,
    friendRequest: false,
    alreadyFriend: false
  }
  let mockPosts: Post[] = [{
    _id: '',
    authorID: '',
    author: [],
    image: '',
    publishedAt: '',
    content: '',
    comments: 0,
    reacts: 0,
    postHasLikes: false,
    postHasLoves: false,
    postHasWows: false
  }]
  const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CommunityComponent],
    }).compileComponents();
    localStorage.setItem("token",token)
    fixture = TestBed.createComponent(CommunityComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(API_URL + `/api/students/getStudent/${mockStudent.email}`)
    req1.flush(mockStudent)
    const req5 = httpMock.expectOne(API_URL + `/api/frequests/getFriendRequests/${component.account._id}`)
    req5.flush(mockPosts)
    const req2 = httpMock.expectOne(API_URL + `/api/posts/getAllPosts`)
    req2.flush(mockPosts)
    const req3 = httpMock.expectOne(API_URL + `/api/frequests/getStudentRequests/${component.account._id}`)
    req3.flush(mockPosts)
    const req4 = httpMock.expectOne(API_URL + `/api/students/getAllStudents`)
    req4.flush([mockStudent,mockStudent])
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccount()', () => {
    it('should get the account of the signed in user', () => {
      component.getAccount()
      const req1 = httpMock.expectOne(API_URL + `/api/students/getStudent/${mockStudent.email}`)
      expect(req1.request.method).toBe("GET")
      req1.flush(mockStudent)
      const req5 = httpMock.expectOne(API_URL + `/api/frequests/getFriendRequests/${component.account._id}`)
      req5.flush(mockPosts)
      const req3 = httpMock.expectOne(API_URL + `/api/frequests/getStudentRequests/${component.account._id}`)
      req3.flush(mockPosts)
      const req4 = httpMock.expectOne(API_URL + `/api/students/getAllStudents`)
      req4.flush([mockStudent,mockStudent])
      expect(component.account).toBe(mockStudent);
    });
  });

  describe('getAllStudents()', () => {
    it('should get all students in the system', () => {
      component.getAllStudents()
      const req = httpMock.expectOne(API_URL + `/api/students/getAllStudents`)
      expect(req.request.method).toBe("GET")
      req.flush([mockStudent,mockStudent])
      expect(component.students).toEqual([mockStudent,mockStudent]);
    });
  });

  describe('createChat()', () => {
    it('should create/join chat between two students', () => {
      spyOn(component.router,'navigateByUrl')
      component.createChat(mockStudent._id)
      const req = httpMock.expectOne(API_URL + `/api/chats/createChat`)
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual({
        chat: {
          person1_ID: component.account._id,
          person2_ID: mockStudent._id,
          newMessages: 0,
          messages: [],
        },
      })
      let mockRespone = {id: '1234'}
      req.flush(mockRespone)
      expect(component.router.navigateByUrl).toHaveBeenCalledWith(`/account/messages/${mockRespone.id}`);
    });
  });

  describe('createPost()', () => {
    it('should create a post if content isn\'t empty', () => {
      spyOn(component.toast,'success')
      spyOn(component,'getAllPosts')
      component.content = 'mockContent'
      component.createPost()
      const req = httpMock.expectOne(API_URL + `/api/posts/createPost`)
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual({
        postt: {
          authorID: component.account._id,
          image: component.imageURL,
          publishedAt: new Date().toUTCString(),
          content: component.content,
          comments: 0,
          reacts: 0,
          postHasLikes: false,
          postHasLoves: false,
          postHasWows: false,
        },
      })
      let mockResponse = {message: "success"}
      req.flush(mockResponse)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getAllPosts).toHaveBeenCalled()
      expect(component.opened).toBeFalse()
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      spyOn(component,'getAllPosts')
      component.content = 'mockContent'
      component.createPost()
      const req = httpMock.expectOne(API_URL + `/api/posts/createPost`)
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual({
        postt: {
          authorID: component.account._id,
          image: component.imageURL,
          publishedAt: new Date().toUTCString(),
          content: component.content,
          comments: 0,
          reacts: 0,
          postHasLikes: false,
          postHasLoves: false,
          postHasWows: false,
        },
      })
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });

    it('should toast an error if content is empty', () => {
      spyOn(component.toast,'error')
      component.content = ''
      component.createPost()
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('refreshPosts()', () => {
    it('should refresh posts in the feed', fakeAsync(() => {
      spyOn(component,'getAllPosts')
      component.refreshPosts()
      expect(component.refreshing).toBeTrue()
      tick(2000)
      expect(component.refreshing).toBeFalse()
      expect(component.getAllPosts).toHaveBeenCalled();
    }));
  });

  describe('refresh()', () => {
    it('should refresh the posts if react has occurred', () => {
      spyOn(component,'getAllPosts')
      component.refresh(true)
      expect(component.getAllPosts).toHaveBeenCalled();
    });
  });

  describe('sendFriendRequest()', () => {
    it('should send a friend request to the student', () => {
      spyOn(component.toast,'success')
      spyOn(component,'getAllPendingRequests')
      component.sendFriendRequest(mockStudent)
      const req = httpMock.expectOne(API_URL + '/api/frequests/sendFriendRequest')
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual({
        request: {
          to: mockStudent._id,
          from: component.account._id,
          read: false,
        },
      })
      let mockResponse = {message: "success"}
      req.flush(mockResponse)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getAllPendingRequests).toHaveBeenCalled()
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      component.sendFriendRequest(mockStudent)
      const req = httpMock.expectOne(API_URL + '/api/frequests/sendFriendRequest')
      expect(req.request.method).toBe("POST")
      expect(req.request.body).toEqual({
        request: {
          to: mockStudent._id,
          from: component.account._id,
          read: false,
        },
      })
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('acceptRequest()', () => {
    it('should accept a friend request of the student', () => {
      spyOn(component.toast,'success')
      spyOn(component,'getAllPendingRequests')
      spyOn(component,'getFriendRequests')
      component.acceptRequest(mockStudent)
      const req = httpMock.expectOne(API_URL + '/api/frequests/acceptRequest')
      expect(req.request.method).toBe("POST")
      let mockResponse = {message: "success"}
      req.flush(mockResponse)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getAllPendingRequests).toHaveBeenCalled()
      expect(component.getFriendRequests).toHaveBeenCalled()
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      component.acceptRequest(mockStudent)
      const req = httpMock.expectOne(API_URL + '/api/frequests/acceptRequest')
      expect(req.request.method).toBe("POST")
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('rejectRequest()', () => {
    it('should reject a friend request of the student', () => {
      spyOn(component.toast,'success')
      spyOn(component,'getAllPendingRequests')
      spyOn(component,'getFriendRequests')
      component.rejectRequest(mockStudent)
      const req = httpMock.expectOne(API_URL + '/api/frequests/rejectRequest')
      expect(req.request.method).toBe("POST")
      let mockResponse = {message: "success"}
      req.flush(mockResponse)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getAllPendingRequests).toHaveBeenCalled()
      expect(component.getFriendRequests).toHaveBeenCalled()
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      component.rejectRequest(mockStudent)
      const req = httpMock.expectOne(API_URL + '/api/frequests/rejectRequest')
      expect(req.request.method).toBe("POST")
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

});
