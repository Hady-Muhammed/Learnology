import { Student } from './../../../../../../app/models/student';
import { API_URL } from './../../../../../../app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendsComponent } from './friends.component';
import { FriendRequest } from 'src/app/models/friendRequest';

describe('FriendsComponent', () => {
  let component: FriendsComponent;
  let fixture: ComponentFixture<FriendsComponent>;
  let httpMock: HttpTestingController;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockStudent: Student;
  let mockFriends: Student[];
  let mockFriendRequests: FriendRequest[];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FriendsComponent],
    }).compileComponents();
    mockStudent = {
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
      alreadyFriend: false,
    };
    mockFriendRequests = [
      {
        _id: '',
        to: '',
        from: '',
        read: false,
        sender: [],
      },
    ];
    mockFriends = [mockStudent]
    localStorage.setItem("token",token)
    fixture = TestBed.createComponent(FriendsComponent);
    component = fixture.componentInstance;
    component.account = mockStudent
    httpMock = TestBed.inject(HttpTestingController);
    // Constructor requests
    const req1 = httpMock.expectOne(API_URL + `/api/students/getStudent/${mockStudent.email}`)
    // req1.flush(mockStudent)
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify()
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFriends()', () => {
    it('should get all the friends of a student', () => {
      component.getFriends();
      component.friends.subscribe();
      const req = httpMock.expectOne(
        API_URL + `/api/students/getFriends/${mockStudent.email}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockStudent);
    });
  });

  describe('getFriendsRequests()', () => {
    it('should friend requests of a student', () => {
      component.getFriendRequests();
      const req = httpMock.expectOne(
        API_URL + `/api/frequests/getFriendRequests/${mockStudent._id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockFriendRequests);
      expect(component.friendRequests).toBe(mockFriendRequests);
      expect(component.numOfUnreadRequests).toBe(0);
    });
  });

  describe('openRequests()', () => {
    it('should open the requests menu', () => {
      spyOn(component,'getFriendRequests')
      component.openRequests()
      expect(component.showRequests).toBeTrue()
      expect(component.getFriendRequests).toHaveBeenCalled()
    });
  });

  describe('acceptRequest()', () => {
    it('should accept the request of a pending friend', () => {
      let mockRequestID = "5"
      spyOn(component.toast,'success')
      spyOn(component,'getFriendRequests')
      component.acceptRequest(mockStudent,mockRequestID)
      const req = httpMock.expectOne(
        API_URL + `/api/frequests/acceptRequest`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        person1: component.account,
        person2: mockStudent,
        requestID: mockRequestID,
      });
      let mockResponse = {message: "success"}
      req.flush(mockResponse)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getFriendRequests).toHaveBeenCalled()
    });

    it('should toast an error if something went wrong', () => {
      let mockRequestID = "5"
      spyOn(component.toast,'error')
      component.acceptRequest(mockStudent,mockRequestID)
      const req = httpMock.expectOne(
        API_URL + `/api/frequests/acceptRequest`
      );
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('rejectRequest()', () => {
    it('should reject the request of a pending friend', () => {
      let mockRequestID = "5"
      spyOn(component.toast,'success')
      spyOn(component,'getFriendRequests')
      component.rejectRequest(mockRequestID)
      const req = httpMock.expectOne(
        API_URL + `/api/frequests/rejectRequest`
      );
      expect(req.request.method).toBe('POST');
      let mockResponse = {message: "success"}
      req.flush(mockResponse)
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.getFriendRequests).toHaveBeenCalled()
    });

    it('should toast an error if something went wrong', () => {
      let mockRequestID = "2"
      spyOn(component.toast,'error')
      component.rejectRequest(mockRequestID)
      const req = httpMock.expectOne(
        API_URL + `/api/frequests/rejectRequest`
      );
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent("Error"))
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('getNoOfUnreadFriendRequests()', () => {
    it('should get the number of unread friend requests of a student', () => {
      component.getNoOfUnreadFriendRequests()
      const req = httpMock.expectOne(
        API_URL + `/api/frequests/getNoOfUnreadFriendRequests/${mockStudent._id}`
      );
      expect(req.request.method).toBe('GET');
      let mockResponse = {numOfRequests: 4}
      req.flush(mockResponse)
      expect(component.numOfUnreadRequests).toBe(mockResponse.numOfRequests)
    });
  });
});
