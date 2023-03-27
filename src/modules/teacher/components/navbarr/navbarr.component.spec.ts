import { Teacher } from './../../../../app/models/teacher';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_URL } from 'src/app/services/socketio.service';

import { NavbarrComponent } from './navbarr.component';

describe('NavbarComponent', () => {
  let component: NavbarrComponent;
  let fixture: ComponentFixture<NavbarrComponent>;
  let httpMock: HttpTestingController
  let mockTeacher: Teacher = {
    _id: '',
    name: '',
    email: 'test@example.com',
    password: '',
    title: '',
    picture: '',
    courses_teaching: [],
    createdAt: '',
    articles_published: [],
    quizzes_published: [],
    likes: 0,
    online: false,
    last_activity: ''
  }
  const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [NavbarrComponent],
    }).compileComponents();
    localStorage.setItem("token",token)
    fixture = TestBed.createComponent(NavbarrComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController)
    // Constructor requests
    const req1 = httpMock.expectOne(API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`)
    req1.flush(mockTeacher)
    const req2 = httpMock.expectOne(API_URL + `/api/chats/getChats/${component.account._id}`)
    req2.flush([{}])
    const req3 = httpMock.expectOne(API_URL + `/api/inboxes/getAllUnreadInboxes/${component.account._id}`)
    req3.flush([{}])
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccount()', () => {
    it('should get account of the signed in teacher', () => {
      spyOn(component,'connectToSocket')
      spyOn(component,'getNoOfUnreadMessages')
      spyOn(component,'getNoOfUnreadInboxes')
      component.getAccount()
      const req = httpMock.expectOne(
        API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
      );
      req.flush(mockTeacher);
      expect(component.connectToSocket).toHaveBeenCalled()
      expect(component.getNoOfUnreadMessages).toHaveBeenCalled()
      expect(component.getNoOfUnreadInboxes).toHaveBeenCalled()
    });
  });

  describe('connectToSocket()', () => {
    it('should connect to socket if he/she hadn\'t connected before', () => {
      spyOn(component,'isConnectedToSocket').and.returnValue(false)
      spyOn(component.socketService,'setupSocketConnection')
      spyOn(component.socketService,'online')
      component.connectToSocket()
      expect(component.socketService.setupSocketConnection).toHaveBeenCalled()
      expect(component.socketService.online).toHaveBeenCalled()
    });
  });

  describe('isConnectedToSocket()', () => {
    it('should return true if he/she had connected before', () => {
      component.socketService.socket.connected = true
      expect(component.isConnectedToSocket()).toBeTrue()
    });

    it('should return false if he/she hadn\'t connected before', () => {
      expect(component.isConnectedToSocket()).toBeFalse()
    });
  });

  describe('getNoOfUnreadMessages()', () => {
    it('should get num of unread messages of a teacher', () => {
      component.getNoOfUnreadMessages()
      const req = httpMock.expectOne(
        API_URL + `/api/chats/getChats/${component.account._id}`
      );
      expect(req.request.method).toBe("GET")
      req.flush([{}]);
    });
  });

  describe('getNoOfUnreadInboxes()', () => {
    it('should get num of unread inboxes of a teacher', () => {
      component.getNoOfUnreadInboxes()
      const req = httpMock.expectOne(
        API_URL + `/api/inboxes/getAllUnreadInboxes/${component.account._id}`
      );
      expect(req.request.method).toBe("GET")
      req.flush([{}]);
    });
  });

  describe('logOut()', () => {
    it('should logout the teacher', () => {
      spyOn(component.router,'navigateByUrl')
      spyOn(component.socketService,'disconnect')
      component.logOut()
      expect(component.router.navigateByUrl).toHaveBeenCalledWith("/signup")
      expect(component.socketService.disconnect).toHaveBeenCalled()
      expect(localStorage.getItem("token")).toBeFalsy()
    });
  });
});
