import { API_URL } from './../../../../app/services/socketio.service';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmailsComponent } from './admin-emails.component';
import { Email } from 'src/app/models/email';

describe('AdminEmailsComponent', () => {
  let component: AdminEmailsComponent;
  let fixture: ComponentFixture<AdminEmailsComponent>;
  let httpMock: HttpTestingController;
  let mockEmails: Email[] = [
    {
      _id: '',
      belongsTo: '',
      subject: '',
      sentAt: '',
      body: '',
      sender: undefined,
      read: false,
      replied: false,
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AdminEmailsComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminEmailsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  beforeEach(() => {
    // Constructor requests
    const req1 = httpMock.expectOne(API_URL + `/api/emails/getAllEmails`);
    req1.flush(mockEmails);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllEmails()', () => {
    it('should get all emails', () => {
      component.getAllEmails();
      component.emails.subscribe();
      const request = httpMock.expectOne(`${API_URL}/api/emails/getAllEmails`);
      expect(request.request.method).toBe('GET');
      request.flush(mockEmails);
      expect(component.emails).toBeTruthy();
    });
  });

  describe('deleteEmail()', () => {
    it('should delete the email with the specified id', () => {
      let mockID = '5';
      spyOn(component.toast, 'success');
      spyOn(component, 'getAllEmails');
      component.deleteEmail(mockID);
      const req1 = httpMock.expectOne(
        API_URL + `/api/emails/deleteEmail/${mockID}`
      );
      expect(req1.request.method).toBe('DELETE');
      req1.flush({ message: '3aash' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAllEmails).toHaveBeenCalled();
    });
    it('should toast an error if something went wrong', () => {
      let mockID = '5';
      spyOn(component.toast,'error')
      component.deleteEmail(mockID);
      const req = httpMock.expectOne(
        API_URL + `/api/emails/deleteEmail/${mockID}`
      );
      expect(req.request.method).toBe('DELETE');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('emailRead()', () => {
    it('should mark the email as read', () => {
      let mockEmail: Email = {
        _id: '234',
        belongsTo: '',
        subject: '',
        sentAt: '',
        body: '',
        sender: undefined,
        read: false,
        replied: false,
      };
      component.emailRead(mockEmail);
      const req = httpMock.expectOne(API_URL + `/api/emails/emailRead`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        id: mockEmail._id,
      });
      req.flush(null);
    });
  });

  describe('openModal()', () => {
    it('should open the modal', () => {
      component.openModal();
      expect(component.opened).toBeTruthy();
    });
  });

  describe('broadcastToAllStudents()', () => {
    it('should broadcast an inbox to all students', () => {
      spyOn(component.toast,'success')
      component.subject.setValue("mock")
      component.body.setValue("mock")
      component.broadcastToAllStudents();
      const req = httpMock.expectOne(
        API_URL + '/api/inboxes/broadcastToAllStudents'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        inboxx: {
          subject: component.subject.value,
          sentAt: new Date().toUTCString(),
          body: component.body.value,
          read: false,
        },
      });
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.subject.value).toBe("")
      expect(component.body.value).toBe("")
      expect(component.opened).toBeFalse()
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      component.broadcastToAllStudents();
      const req = httpMock.expectOne(
        API_URL + '/api/inboxes/broadcastToAllStudents'
      );
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('broadcastToAllTeachers()', () => {
    it('should broadcast an inbox to all teachers', () => {
      spyOn(component.toast,'success')
      component.subject.setValue("mock")
      component.body.setValue("mock")
      component.broadcastToAllTeachers();
      const req = httpMock.expectOne(
        API_URL + '/api/inboxes/broadcastToAllTeachers'
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        inboxx: {
          subject: component.subject.value,
          sentAt: new Date().toUTCString(),
          body: component.body.value,
          read: false,
        },
      });
      let mockResponse = { message: 'success' };
      req.flush(mockResponse);
      expect(component.toast.success).toHaveBeenCalled()
      expect(component.subject.value).toBe("")
      expect(component.body.value).toBe("")
      expect(component.opened).toBeFalse()
    });

    it('should toast an error if something went wrong', () => {
      spyOn(component.toast,'error')
      component.broadcastToAllTeachers();
      const req = httpMock.expectOne(
        API_URL + '/api/inboxes/broadcastToAllTeachers'
      );
      expect(req.request.method).toBe('POST');
      req.error(new ProgressEvent('Error'));
      expect(component.toast.error).toHaveBeenCalled()
    });
  });

  describe('handleBroadcasting()', () => {
    it('should broadcast to all teachers if the selected option is teacher', () => {
      spyOn(component,'broadcastToAllTeachers')
      component.subject.setValue("mock")
      component.body.setValue("mock")
      component.selectedOption = 'Teacher'
      component.handleBroadcasting()
      expect(component.broadcastToAllTeachers).toHaveBeenCalled()
    });
    it('should broadcast to all students if the selected option is student', () => {
      spyOn(component,'broadcastToAllStudents')
      component.subject.setValue("mock")
      component.body.setValue("mock")
      component.selectedOption = 'Student'
      component.handleBroadcasting()
      expect(component.broadcastToAllStudents).toHaveBeenCalled()
    });
  });
});
