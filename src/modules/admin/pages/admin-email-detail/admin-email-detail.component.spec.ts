import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Email } from 'src/app/models/email';
import { API_URL } from './../../../../app/services/socketio.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailDetailComponent } from './admin-email-detail.component';

describe('AdminEmailDetailComponent', () => {
  let component: AdminEmailDetailComponent;
  let fixture: ComponentFixture<AdminEmailDetailComponent>;
  let httpMock: HttpTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AdminEmailDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEmailDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getEmail()', () => {
    it('should get the email specified', () => {
      let mockEmail: Email = {
        _id: '',
        belongsTo: '',
        subject: '',
        sentAt: '',
        body: '',
        sender: undefined,
        read: false,
        replied: false,
      };
      let id = '1';
      component.getEmail(id);
      const req = httpMock.expectOne(API_URL + `/api/emails/getEmail/${id}`);
      req.flush([mockEmail]);
      expect(component.email).toEqual(mockEmail);
    });
  });

  describe('sendInbox()', () => {
    it('should send inbox email to the users', () => {
      spyOn(component, 'emailGotReplied');
      spyOn(component.toast, 'success');
      let mockEmail: Email = {
        _id: '',
        belongsTo: '',
        subject: '',
        sentAt: '',
        body: '',
        sender: undefined,
        read: false,
        replied: false,
      };
      component.email = mockEmail;
      component.sendInbox();

      const req = httpMock.expectOne(API_URL + '/api/inboxes/sendInbox');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        inbox: {
          to: undefined,
          subject: component.subject.value,
          sentAt: new Date().toUTCString(),
          body: component.body.value,
          read: false,
          replied: false,
        },
      });

      req.flush({ message: 'success' });
      expect(component.emailGotReplied).toHaveBeenCalled();
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.subject.value).toBe('');
      expect(component.body.value).toBe('');
      expect(component.opened).toBe(false);
    });
    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      let mockEmail: Email = {
        _id: '',
        belongsTo: '',
        subject: '',
        sentAt: '',
        body: '',
        sender: undefined,
        read: false,
        replied: false,
      };
      component.email = mockEmail;
      component.sendInbox();

      const req = httpMock.expectOne(API_URL + '/api/inboxes/sendInbox');
      expect(req.request.method).toBe('POST');
      let mockError = new ProgressEvent('Errorr!');
      req.error(mockError);
      expect(component.toast.error).toHaveBeenCalled();
    });
  });

  describe('emailGotReplied()', () => {
    it('should mark email as replied in the database', () => {
      spyOn(component, 'getEmail');
      let mockEmail: Email = {
        _id: 'mock',
        belongsTo: '',
        subject: '',
        sentAt: '',
        body: '',
        sender: undefined,
        read: false,
        replied: false
      }
      component.email = mockEmail
      component.emailGotReplied()
      const req = httpMock.expectOne(API_URL + '/api/emails/emailGotReplied');
      expect(req.request.method).toBe('PATCH');

      req.flush({message: 'success'});
      expect(component.getEmail).toHaveBeenCalled();
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast, 'error');
      let mockEmail: Email = {
        _id: 'mock',
        belongsTo: '',
        subject: '',
        sentAt: '',
        body: '',
        sender: undefined,
        read: false,
        replied: false
      }
      component.email = mockEmail
      component.emailGotReplied()
      const req = httpMock.expectOne(API_URL + '/api/emails/emailGotReplied');
      expect(req.request.method).toBe('PATCH');
      let mockError = new ProgressEvent("Error")
      req.error(mockError);
      expect(component.toast.error).toHaveBeenCalled();
    });
  });
});
