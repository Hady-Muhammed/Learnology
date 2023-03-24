import { Chat } from 'src/app/models/chat';
import { Student } from 'src/app/models/student';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AccountComponent } from './account.component';
import { API_URL } from 'src/app/services/socketio.service';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let httpMock: HttpTestingController;
  let mockStudent: Student;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AccountComponent],
    }).compileComponents();
    localStorage.setItem('token', token);
    mockStudent = {
      _id: '4',
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
    fixture = TestBed.createComponent(AccountComponent);
    httpMock = TestBed.inject(HttpTestingController);
    const req1 = httpMock.expectOne(
      API_URL + `/api/students/getStudent/${mockStudent.email}`
    );
    req1.flush(mockStudent);

    const req2 = httpMock.expectOne(
      API_URL + `/api/frequests/getNoOfUnreadFriendRequests/${mockStudent._id}`
    );
    req2.flush(mockStudent);

    const req3 = httpMock.expectOne(
      API_URL + `/api/chats/getChats/${mockStudent._id}`
    );
    req3.flush(mockStudent);

    const req4 = httpMock.expectOne(
      API_URL + `/api/inboxes/getAllUnreadInboxes/${mockStudent._id}`
    );
    req4.flush(mockStudent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAccount()', () => {
    it('should get account details from API', () => {
      component.getAccount();
      const req1 = httpMock.expectOne(
        API_URL + `/api/students/getStudent/${mockStudent.email}`
      );
      req1.flush(mockStudent);

      const req2 = httpMock.expectOne(
        API_URL +
          `/api/frequests/getNoOfUnreadFriendRequests/${mockStudent._id}`
      );
      req2.flush(mockStudent);

      const req3 = httpMock.expectOne(
        API_URL + `/api/chats/getChats/${mockStudent._id}`
      );
      req3.flush(mockStudent);

      const req4 = httpMock.expectOne(
        API_URL + `/api/inboxes/getAllUnreadInboxes/${mockStudent._id}`
      );
      req4.flush(mockStudent);

      expect(component.account).toEqual(mockStudent);
    });
  });

  describe('getNoOfUnreadFriendRequests()', () => {
    it('should get number of unread friend requests from API', () => {
      const mockResponse = { numOfRequests: 5 };
      component.getNoOfUnreadFriendRequests();
      const req = httpMock.expectOne(
        `${API_URL}/api/frequests/getNoOfUnreadFriendRequests/${component.account._id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
      expect(component.numOfUnreadRequests).toEqual(mockResponse.numOfRequests);
    });
  });

  describe('getNoOfUnreadMessages()', () => {
    it('should get number of unread messages from API', () => {
      const mockChats = [{ newMessages: 2 }, { newMessages: 4 }];
      component.getNoOfUnreadMessages();
      const req = httpMock.expectOne(
        `${API_URL}/api/chats/getChats/${component.account._id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockChats);
      let unreadMessages = 0;
      for (const chat of mockChats) {
        unreadMessages += chat.newMessages;
      }
      expect(component.numOfUnreadMessages).toBe(unreadMessages);
    });
  });

  describe('getNoOfUnreadInboxes()', () => {
    it('should get number of unread inboxes from API', () => {
      const mockResponse = { numOfUnread: 2 };
      component.getNoOfUnreadInboxes();
      const req = httpMock.expectOne(
        `${API_URL}/api/inboxes/getAllUnreadInboxes/${component.account._id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
      expect(component.numOfUnreadInboxes).toEqual(mockResponse.numOfUnread);
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
