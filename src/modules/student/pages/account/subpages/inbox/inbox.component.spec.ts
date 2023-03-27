import { Inbox } from 'src/app/models/inbox';
import { Student } from './../../../../../../app/models/student';
import { API_URL } from './../../../../../../app/services/socketio.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxComponent } from './inbox.component';

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;
  let httpMock: HttpTestingController
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockInboxes: Inbox[] = [{
    _id: '',
    to: '',
    subject: '',
    sentAt: '',
    body: '',
    read: false
  }]
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
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ InboxComponent ]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController)
    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    // Constructor requests
    const req1 = httpMock.expectOne(API_URL + `/api/students/getStudent/${mockStudent.email}`)
    req1.flush(mockStudent)
    component.inboxes.subscribe()
    const req2 = httpMock.expectOne(API_URL + `/api/inboxes/getInboxesForStudent/${mockStudent._id}`)
    req2.flush(mockStudent)
  });

  afterEach(() => {
    httpMock.verify()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccount()', () => {
    it('should get account of the signed in student', () => {
      spyOn(component,'getInboxesForStudent')
      component.getAccount()
      const req = httpMock.expectOne(
        API_URL + `/api/students/getStudent/${mockStudent.email}`
      );
      req.flush(mockStudent);
      expect(component.getInboxesForStudent).toHaveBeenCalled()
    });
  });

  describe('getInboxesForStudent()', () => {
    it('should get all inboxes that have been taken by the signed in student', () => {
      component.getInboxesForStudent()
      component.inboxes.subscribe()
      const req = httpMock.expectOne(
        API_URL + `/api/inboxes/getInboxesForStudent/${component.account._id}`
      );
      expect(req.request.method).toBe("GET")
      req.flush(mockInboxes);
    });
  });
});
