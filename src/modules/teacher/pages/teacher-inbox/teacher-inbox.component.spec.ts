import { Inbox } from 'src/app/models/inbox';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherInboxComponent } from './teacher-inbox.component';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';

describe('TeacherInboxComponent', () => {
  let component: TeacherInboxComponent;
  let fixture: ComponentFixture<TeacherInboxComponent>;
  let httpMock: HttpTestingController;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';
  let mockInboxes: Inbox[] = [
    {
      _id: '',
      to: '',
      subject: '',
      sentAt: '',
      body: '',
      read: false,
    },
  ];
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
    last_activity: '',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TeacherInboxComponent],
    }).compileComponents();
    localStorage.setItem('token', token);
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TeacherInboxComponent);
    component = fixture.componentInstance;
    // Constructor requests
    const req1 = httpMock.expectOne(
      API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
    );
    req1.flush(mockTeacher);
    component.inboxes.subscribe();
    const req2 = httpMock.expectOne(
      API_URL + `/api/inboxes/getInboxesForTeacher/${mockTeacher._id}`
    );
    req2.flush(mockInboxes);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccount()', () => {
    it('should get account of the signed in teacher', () => {
      spyOn(component, 'getInboxesForTeacher');
      component.getAccount();
      const req = httpMock.expectOne(
        API_URL + `/api/teachers/getTeacher/${mockTeacher.email}`
      );
      req.flush(mockTeacher);
      expect(component.getInboxesForTeacher).toHaveBeenCalled();
    });
  });

  describe('getInboxesForTeacher()', () => {
    it('should get all inboxes that have been taken by the signed in teacher', () => {
      component.getInboxesForTeacher();
      component.inboxes.subscribe();
      const req = httpMock.expectOne(
        API_URL + `/api/inboxes/getInboxesForTeacher/${component.account._id}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockInboxes);
    });
  });
});
