import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
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
    alreadyFriend: false,
  };
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.2hDgYvYRtr7VZmHl2XGnM45vQJjRzF6cK5n5dY6vZ5c';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [ContactComponent],
    }).compileComponents();

    localStorage.setItem('token', token);
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    const req = httpMock.expectOne(
      API_URL + `/api/students/getStudent/${mockStudent.email}`
    );
    req.flush(mockStudent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAccount()', () => {
    it('should get the account of the signed in student', () => {
      component.getAccount();
      const req = httpMock.expectOne(
        API_URL + `/api/students/getStudent/${mockStudent.email}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockStudent);
      expect(component.account).toBe(mockStudent);
    });
  });

  describe('sendEmail()', () => {
    it('should send email to the admin', () => {
      spyOn(component.toast, 'success');
      component.body.setValue('mock');
      component.fname.setValue('mock');
      component.lname.setValue('mock');
      component.subject.setValue('mock');
      component.sendEmail();
      const req = httpMock.expectOne(API_URL + `/api/emails/sendEmail`);
      expect(req.request.method).toBe('POST');
      console.log(component.body.value);
      expect(req.request.body).toEqual({
        email: {
          subject: component.subject.value,
          sentAt: new Date().toUTCString(),
          belongsTo: component.account._id,
          body: component.body.value,
          read: false,
          replied: false,
        },
      });
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.body.value).toBe("");
      expect(component.fname.value).toBe("");
      expect(component.lname.value).toBe("");
      expect(component.subject.value).toBe("");
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      component.body.setValue('mock');
      component.fname.setValue('mock');
      component.lname.setValue('mock');
      component.subject.setValue('mock');
      component.sendEmail();
      const req = httpMock.expectOne(API_URL + `/api/emails/sendEmail`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: {
          subject: component.subject.value,
          sentAt: new Date().toUTCString(),
          belongsTo: component.account._id,
          body: component.body.value,
          read: false,
          replied: false,
        },
      });
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
