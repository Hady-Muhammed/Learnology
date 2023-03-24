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

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllEmails()', () => {
    it('should set the emails property with the response from the server', () => {
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
      component.getAllEmails();
      const req = httpMock.expectOne(API_URL + '/api/emails/getAllEmails');
      expect(req.request.method).toBe('GET');
      req.flush(mockEmails);
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
      const req2 = httpMock.expectOne(
        API_URL + `/api/emails/getAllEmails`
      );
      expect(req1.request.method).toBe('DELETE');
      expect(req2.request.method).toBe('GET');
      req1.flush({ message: '3aash' });
      expect(component.toast.success).toHaveBeenCalled();
      expect(component.getAllEmails).toHaveBeenCalled();
    });
  });

  // describe('emailRead()', () => {
  //   it('should delete the email with the specified id', () => {
  //     let mockEmail: Email = {
  //       _id: '234',
  //       belongsTo: '',
  //       subject: '',
  //       sentAt: '',
  //       body: '',
  //       sender: undefined,
  //       read: false,
  //       replied: false
  //     }
  //     component.emailRead(mockEmail);
  //     const req = httpMock.expectOne(
  //       API_URL + `/api/emails/emailRead`
  //     );
  //     expect(req.request.method).toBe('PATCH');
  //     expect(req.request.body).toBe({
  //       id: mockEmail._id
  //     });
  //     req.flush(null);
  //   });
  // });
});
